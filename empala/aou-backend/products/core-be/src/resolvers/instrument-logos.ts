import {
  Resolver, Arg, Mutation, UseMiddleware, Authorized,
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { CreateErrorHandler } from '../utils/middlewares/error-handler';
import { EAccessRole } from '../security/auth-checker';
import { InstrumentLogos } from '../models/instrument-logos';
import { CreateInstrumentLogosResult, CreateInstrumentLogosSuccess } from '../results/create-instrument-logos';
import { CreateInstrumentLogosInput } from '../inputs/create-instrument-logos';
import { Instrument } from '../models/instrument';

@Resolver(InstrumentLogos)
export class InstrumentLogosResolver {
  @Authorized([EAccessRole.MARKETDATA_UPDATER])
  @Mutation(() => CreateInstrumentLogosResult)
  @UseMiddleware(CreateErrorHandler)
  public async createInstrumentLogos(
    @Arg('input', () => CreateInstrumentLogosInput, { nullable: false }) input: CreateInstrumentLogosInput,
  ): Promise<typeof CreateInstrumentLogosResult> {
    const {
      logo, logoNormal, logoOriginal, logoSquare, logoSquareStrict, logoThumbnail,
    } = input;

    const instr = await Instrument.findOne(Number(input.instId), {
      relations: ['logos'],
    });

    let logos = instr.logos as InstrumentLogos;
    if (logos) {
      Object.assign(logos, {
        logo, logoNormal, logoOriginal, logoSquare, logoSquareStrict, logoThumbnail,
      });

      // without this hack with id it tries to update id column as well despite it's autogenerated
      const logosId = logos.id;
      delete logos.id;
      await InstrumentLogos.update(Number(logosId), logos);
      logos.id = logosId;
    } else {
      logos = Object.assign(new InstrumentLogos(), {
        logo, logoNormal, logoOriginal, logoSquare, logoSquareStrict, logoThumbnail,
      });
      instr.logos = logos;
      await getRepository(Instrument).save(instr);
    }

    const result = new CreateInstrumentLogosSuccess();
    result.logos = logos;
    return result;
  }
}
