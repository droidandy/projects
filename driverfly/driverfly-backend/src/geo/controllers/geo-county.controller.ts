import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StateEntity } from "../entities";
import { GeoService } from "../services/geo.service";

@ApiTags('geo')
@Controller("geo/states/:stateId/counties")
export class GeoCountyController {
  constructor(private readonly geoService: GeoService) {}

  @Get("/")
  async getCountiesByStateId(
    @Param("stateId") stateId: number,
  ) {
    return await this.geoService.getCountiesByStateId(stateId);
  }

  @Get("/:countyId/neighborhoods")
  async getNeighborhoodsByStateIdAndCountyId(
    @Param("stateId") stateId: number,
    @Param("countyId") countyId: number,
  ) {
    return await this.geoService.getNeighborhoodsByStateIdAndCountyId(stateId, countyId);
  }
}
