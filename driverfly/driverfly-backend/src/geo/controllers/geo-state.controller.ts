import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { StateEntity } from "../entities";
import { GeoService } from "../services/geo.service";

@ApiTags('geo')
@Controller("geo/states")
export class GeoStateController {
  constructor(private readonly geoService: GeoService) {}

  @Get("/")
  async getStates() {
    return await this.geoService.getStates();
  }

  @Get("/:stateId/cities")
  async getCitiesByStateId(
    @Param("stateId") stateId: number,
  ) {
    return await this.geoService.getCitiesByStateId(stateId);
  }

  @Get("/:stateId/neighborhoods")
  async getNeighborhoodsByStateId(
    @Param("stateId") stateId: number,
  ) {
    return await this.geoService.getNeighborhoodsByStateId(stateId);
  }
}
