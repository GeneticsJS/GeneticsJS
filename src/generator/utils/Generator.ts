/*
 * @license
 * Copyright (c) 2019 Cristian Abrante. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

// TODO: Better gaussian generator.
import { bool, Engine, integer, MersenneTwister19937, real } from 'random-js';
import { Gaussian } from 'ts-gaussian';
import { NumericRange } from '../../individual/numeric/base';
import { IntegerNormalizer } from '../../individual/numeric/integer/utils';

export class Generator {
  public static DEFAULT_ENGINE: Engine = MersenneTwister19937.autoSeed();

  public static probabilityIsValid(probability: number) {
    return probability >= 0.0 && probability <= 1.0;
  }

  public static generateProbability(engine: Engine = Generator.DEFAULT_ENGINE) {
    return this.generateFloating(new NumericRange(0.0, 1.0), engine);
  }

  public static generateBoolean(chance = 0.5, engine: Engine = Generator.DEFAULT_ENGINE) {
    this.checkProbability(chance);
    return bool(chance)(engine);
  }

  public static generateInteger(range = NumericRange.DEFAULT, engine: Engine = Generator.DEFAULT_ENGINE) {
    const normalizedRange = this.normalizeIntegerRange(range);
    return integer(normalizedRange.lowest, normalizedRange.highest)(engine);
  }

  public static generateFloating(range = NumericRange.DEFAULT, engine: Engine = Generator.DEFAULT_ENGINE) {
    return real(range.lowest, range.highest, true)(engine);
  }

  public static generateNormalDistributionValue(
    mean: number = 0.0,
    stdVar: number = 1.0,
    engine: Engine = Generator.DEFAULT_ENGINE,
  ): number {
    const dist = new Gaussian(mean, stdVar);
    return dist.ppf(this.generateProbability(engine));
  }

  public static generateNormalDistributionInteger(
    mean: number = 0,
    stdVar: number = 1,
    engine: Engine = Generator.DEFAULT_ENGINE,
  ): number {
    return IntegerNormalizer.normalize(this.generateNormalDistributionValue(mean, stdVar, engine));
  }

  /**
   * This method is used due to an issue with
   * `random-js`. It does not accept `Number.Infinity` as
   *  the lowest or highest number, instead it expects
   *  `2 ** 53` as it maximum or `-2 ** 53` as its minimum.
   *  So the range must be normalized.
   * @param range that we want to normalize.
   * @return normalized range.
   */
  private static normalizeIntegerRange(range: NumericRange) {
    const randomJSMax = 2 ** 53;
    const randomJSMin = -randomJSMax;
    const lowest =
      range.lowest === NumericRange.DEFAULT.lowest ? randomJSMin : IntegerNormalizer.normalize(range.lowest);
    const highest =
      range.highest === NumericRange.DEFAULT.highest ? randomJSMax : IntegerNormalizer.normalize(range.highest);
    return new NumericRange(lowest, highest);
  }

  private static checkProbability(probability: number) {
    if (!this.probabilityIsValid(probability)) {
      throw new Error(`Error: probability ${probability} is not in range [0.0, 1.0].`);
    }
  }
}
