import { plainToInstance } from 'class-transformer';
import {
  validateSync,
  ValidationError,
  IsNotEmpty,
  IsString,
  IsNumberString,
} from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  DB_HOST!: string;

  @IsNumberString()
  DB_PORT!: string;

  @IsNotEmpty()
  DB_USERNAME!: string;

  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsNotEmpty()
  DB_NAME!: string;

  @IsNotEmpty()
  NODE_ENV!: string;
}

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors: ValidationError[] = validateSync(validatedConfig, {
    skipMissingProperties: false,
    forbidUnknownValues: true,
  });

  if (errors.length > 0) {
    const errorMessages = errors.flatMap((error) => {
      if (!error.constraints) return [];
      return Object.values(error.constraints);
    });

    throw new Error(
      `Environment validation failed:\n${errorMessages.join('\n')}`,
    );
  }

  return validatedConfig;
}
