import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GeolocationService } from '../services/geolocation.service';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class VerifyAddressDto {
  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  department?: string;
}

export class VerifyCoordinatesDto {
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @IsString()
  @IsOptional()
  address?: string;
}

export class GeolocationResponseDto {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  placeId?: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

@ApiTags('geolocation')
@Controller('geolocation')
export class GeolocationController {
  constructor(private geolocationService: GeolocationService) {}

  @Post('verify-address')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify and geocode an address' })
  @ApiResponse({
    status: 200,
    description: 'Address verified and geocoded successfully',
    type: GeolocationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid address or geocoding failed',
  })
  async verifyAddress(@Body() verifyAddressDto: VerifyAddressDto): Promise<GeolocationResponseDto> {
    try {
      const geocodeResult = await this.geolocationService.geocodeAddress(
        verifyAddressDto.address,
        verifyAddressDto.city,
        verifyAddressDto.department,
      );

      // Validar que las coordenadas estén en Colombia
      if (
        !this.geolocationService.isWithinColombia(geocodeResult.latitude, geocodeResult.longitude)
      ) {
        throw new HttpException(
          'The provided address is not within Colombia',
          HttpStatus.BAD_REQUEST,
        );
      }

      return {
        ...geocodeResult,
        location: this.geolocationService.toLocationData(geocodeResult),
      };
    } catch (error) {
      throw new HttpException(
        `Address verification failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('verify-coordinates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Verify and reverse geocode coordinates' })
  @ApiResponse({
    status: 200,
    description: 'Coordinates verified successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid coordinates',
  })
  async verifyCoordinates(@Body() verifyCoordinatesDto: VerifyCoordinatesDto): Promise<any> {
    try {
      // Validar que las coordenadas estén en Colombia
      if (
        !this.geolocationService.isWithinColombia(
          verifyCoordinatesDto.latitude,
          verifyCoordinatesDto.longitude,
        )
      ) {
        throw new HttpException(
          'The provided coordinates are not within Colombia',
          HttpStatus.BAD_REQUEST,
        );
      }

      const reverseGeocodeResult = await this.geolocationService.reverseGeocode(
        verifyCoordinatesDto.latitude,
        verifyCoordinatesDto.longitude,
      );

      return {
        latitude: verifyCoordinatesDto.latitude,
        longitude: verifyCoordinatesDto.longitude,
        formattedAddress: reverseGeocodeResult.formatted_address,
        addressComponents: reverseGeocodeResult.address_components,
        location: {
          type: 'Point',
          coordinates: [verifyCoordinatesDto.longitude, verifyCoordinatesDto.latitude],
        },
      };
    } catch (error) {
      throw new HttpException(
        `Coordinate verification failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
