import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { js2xml, xml2js, ElementCompact } from "xml-js";
import * as crypto from 'crypto';
import axios from 'axios';
import { URLSearchParams } from 'url';

import { ForwardGeocodeDto } from '../dto';
import { CityRepository, CountyRepository, ForwardGeocodeRepository, NeighborhoodRepository, StateRepository } from '../repositories';
import { CityEntity, CountyEntity, NeighborhoodEntity, StateEntity, ForwardGeocodeEntity } from '../entities';
import { ForwardGeocodable, MapboxGeocodeResponse, UspsAddressResponse } from '../interfaces';

  
@Injectable()
export class GeoService {
  private apiKey: string;
  private uspsUserName: string;

  enabled: boolean;
  constructor(
    @InjectRepository(ForwardGeocodeRepository)
    private forwardGeocodeRepository: ForwardGeocodeRepository,

      @InjectRepository(StateRepository)
      private stateRepository: StateRepository,
      @InjectRepository(CountyRepository)
      private countyRepository: CountyRepository,
      @InjectRepository(CityRepository)
      private cityRepository: CityRepository,
      @InjectRepository(NeighborhoodRepository)
      private neighborhoodRepository: NeighborhoodRepository,

      configService: ConfigService
    ) {
      this.apiKey = configService.get<string>("MAPBOX_API_KEY");
      this.uspsUserName = configService.get<string>("USPS_USER_NAME");

      this.enabled = !!this.apiKey;

      if (!this.enabled) console.warn("geocode service is disabled.");

      if (!this.uspsUserName) console.warn("USPS service is disabled.");
    }

    // getters
    async getStates() {
      const entities: StateEntity[] = await this.stateRepository.find();

      return entities;
    }

    async getCountiesByStateId(stateId: number) {
      return await this.countyRepository.find({ state: new StateEntity(stateId) });
    }

    async getCitiesByStateId(stateId: number) {
      return await this.cityRepository.find({ state: new StateEntity(stateId) });
    }

    async getCitiesByStateIdAndCountyId(stateId: number, countyId: number) {
      return await this.cityRepository.find({ state: new StateEntity(stateId), county: new CountyEntity(countyId) });
    }

    async getNeighborhoodsByStateId(stateId: number) {
      return await this.neighborhoodRepository.find({ state: new StateEntity(stateId) });
    }

    async getNeighborhoodsByStateIdAndCountyId(stateId: number, countyId: number) {
      return await this.neighborhoodRepository.find({ state: new StateEntity(stateId), county: new CountyEntity(countyId) });
    }

    async getNeighborhoodsByStateIdAndCountyIdAndCityId(stateId: number, countyId: number, cityId: number) {
      return await this.neighborhoodRepository.find({ state: new StateEntity(stateId), county: new CountyEntity(countyId), city: new CityEntity(cityId) });
    }

    // forward-geocoding
    async forwardGeocodeAndSet(entity: ForwardGeocodable) {
      if (entity.street && entity.city && entity.state && entity.zip_code) {
        if (this.enabled) {
          const forwardGeocodeEntity = await this.forwardGeocode({
            street: entity.street,
            city: entity.city,
            state: entity.state,
            zip_code: entity.zip_code
          });
    
          if (forwardGeocodeEntity) {
            entity.forwardGeocodeId = forwardGeocodeEntity.id;
            entity.countyId = forwardGeocodeEntity.county?.id;
            entity.neighborhoodId = forwardGeocodeEntity.neighborhood?.id;

            entity.latitude = forwardGeocodeEntity.latitude;
            entity.longitude = forwardGeocodeEntity.longitude;
          }
        }
      }
      else {
        delete entity.forwardGeocodeId;
        delete entity.countyId;
        delete entity.neighborhoodId;
        delete entity.latitude;
        delete entity.longitude;
      }
    }

    async forwardGeocode(dto: ForwardGeocodeDto) {
      dto = await this.normalizeAddress(dto);

      const address: string = `${(dto.street + " " + dto.street2 || "").trim()}, ${dto.city}, ${dto.state} ${dto.zip_code}`.trim();
      const hash = this.computeHash(address);

      let entity: ForwardGeocodeEntity = null;

      // caching is enabled
      if (this.uspsUserName) {
        entity = await this.forwardGeocodeRepository.findOne({ hash: hash });

        // found an entity
        if (entity) {
          console.log("found and returned cached entity");
          return entity;
        }
      }

      entity = new ForwardGeocodeEntity();
      entity.hash = hash;
      
      // geocoding/v5/mapbox.places/1234 Somewhere Place, Irvine, CA 92111.json
      const url: string = `geocoding/v5/mapbox.places/${address}.json`;

      const result: MapboxGeocodeResponse = await this.mapbox(url);

      if (result?.features && result.features.length > 0) {
        const [ feature ] = result.features;

        const { text, address, place_type, place_name, relevance, center: [ lng, lat ], context } = feature;

        // country, region, postcode, district, place, locality, neighborhood, address, and poi
        entity.type = place_type[0];
        entity.relevance = relevance;
        entity.address = place_name;
        entity.longitude = lng;
        entity.latitude = lat;
        entity.street = `${address} ${text}`;

        context.forEach(v => {
          const [ type, id ] = v.id.split(".");

          switch (type) {
            case "neighborhood":
              entity.neighborhood = new NeighborhoodEntity();
              entity.neighborhood.code = id;
              entity.neighborhood.name = v.text;
              break;
            case "postcode":
              entity.zip_code = v.text;
              break;
            case "place":
              entity.city = new CityEntity();
              entity.city.code = id;
              entity.city.name = v.text;
              break;
            case "district":
              entity.county = new CountyEntity();
              entity.county.code = id;
              entity.county.name = v.text;
              break;
            case "region":
              entity.state = new StateEntity();
              entity.state.code = id;
              entity.state.short_code = v.short_code;
              entity.state.name = v.text;
              break;
          }
        });

        if (entity.state) {
          entity.state.code = this.computeHash(entity.state.name);
          // US-CA
          if (entity.state.short_code.includes("-")) {
            entity.state.short_code = entity.state.short_code.split("-")[1];
          }

          const state = await this.stateRepository.findOne({ code: entity.state.code });

          if (state) entity.state = state;
          else entity.state = await this.stateRepository.save(entity.state);
        }

        if (entity.county) {
          if (!entity.state) delete entity.county;
          else {
            // CA_fdf455555 - to optmize text indexing.
            entity.county.code = this.computeHash(entity.state.code + entity.county.name);

            const county = await this.countyRepository.findOne({ code: entity.county.code });

            if (county) entity.county = county;
            else {
              entity.county.state = entity.state;
              entity.county = await this.countyRepository.save(entity.county);
            }
          }
        }

        if (entity.city) {
          if (!entity.county) delete entity.city;
          else {
            // CA_fdf455555_fffff - to optimize indexing
            entity.city.code = this.computeHash(entity.state.code + entity.county.code + entity.city.name);

            const city = await this.cityRepository.findOne({ code: entity.city.code });

            if (city) entity.city = city;
            else {
              entity.city.state = entity.state;
              entity.city.county = entity.county;
              entity.city = await this.cityRepository.save(entity.city);
            }
          }
        }

        if (entity.neighborhood) {
          if (!entity.city) delete entity.neighborhood;
          else {
            // CA_fdf455555_fffff - to optimize indexing
            entity.neighborhood.code = this.computeHash(entity.state.code + entity.county.code + entity.city.code + entity.neighborhood.name);

            const neightborhood = await this.neighborhoodRepository.findOne({ code: entity.neighborhood.code });

            if (neightborhood) entity.neighborhood = neightborhood;
            else {
              entity.neighborhood.state = entity.state;
              entity.neighborhood.county = entity.county;
              entity.neighborhood.city = entity.city;

              entity.neighborhood = await this.neighborhoodRepository.save(entity.neighborhood);
            }
          }
        }

        entity = await this.forwardGeocodeRepository.save(entity);
      }

      return entity; // forward-geocode failed, return nearly empty object
    }

    private async mapbox(url: string) {
      if (!this.apiKey) return; // not enabled

      const qs: URLSearchParams = new URLSearchParams();
      qs.append("country", "us"); // hard coded for now
      qs.append("access_token", this.apiKey);
      qs.append("limit", "1");

      url = `${url}?${qs.toString()}`;

      try {
        const response = await axios.get(url, {
          baseURL: "https://api.mapbox.com/"
        });

        return response.data;
      } catch (e) {
        console.error("Error hitting Geo endpoint", e);
        // empty result
        return {};
      }
    }

    private async normalizeAddress(dto: ForwardGeocodeDto) {
      // address normalization disabled.
      if (!this.uspsUserName) return dto;

      try {
        const [ zip5, zip4 ] = this.splitPostalCode(dto.zip_code);
        const reqJs: ElementCompact = {
          AddressValidateRequest: {
            _attributes: {
              USERID: this.uspsUserName
            },
            Revision: 1,
            Address: {
              _attributes: {
                ID: 0
              },
              Address1: dto.street,
              Address2: dto.street2,
              City: dto.city,
              State: dto.state,
              Zip5: zip5,
              Zip4: zip4
            }
          }
        };
        const xml: string = js2xml(reqJs, { compact: true });

        const url: URL = new URL("https://secure.shippingapis.com/ShippingAPI.dll?API=Verify");
        url.searchParams.append("XML", xml);

        const response = await axios.get(url.toString());

        const result: UspsAddressResponse = xml2js(response.data, { compact: true }) as UspsAddressResponse;

        if (result && result.AddressValidateResponse && result.AddressValidateResponse.Address) {
          const { AddressValidateResponse: { Address } } = result;

          if (Address.Error) {
            console.error(`Unable to normalize address: ${Address.Error?.Description?._text || "unknown error"}`);
            return dto;
          }

          dto.street = (Address.Address1?._text || Address.Address2?._text) as string;
          if (Address.Address1)
          {
            dto.street = Address.Address1._text as string;
            dto.street2 = Address.Address2?._text as string;
          }
          else if (Address.Address2) {
            dto.street = Address.Address2?._text as string;
            if ("street2" in dto)
              delete dto.street2;
          }

          dto.city = (Address.City?._text as string || dto.city);
          dto.state = (Address.State?._text as string || dto.state);
          dto.zip_code = (Address.Zip5?._text as string || zip5);
        }
        else {
          console.warn("Unable to normalize address", response);
        }
      }
      catch (e) {
        console.error("Unable to access USPS endpoint", e);
      }

      return dto;
    }

    private splitPostalCode(zipCode: string) {
      const results = [];
      if (zipCode) {
        if (zipCode.length > 5) {
          results.push(zipCode.substring(0, 5));
          results.push(zipCode.substring(5));
        }
        else
          results.push(zipCode);
      }

      return results;
    }

    private computeHash(text: string) {
      return crypto.createHmac('sha256', text).digest('hex');
    }
  }
  