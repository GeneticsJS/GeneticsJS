/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * Copyright (c) 2020 Francisco Cruz.
 * Copyright (c) 2019 Cristian Abrante.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { Generator } from '../../generator/utils';
import { ListIndividual } from '../../index';
import { List } from '../../index';
import { NumericRange } from '../../individual';
import { UniformMutation, UniformMutationParams as InnerExchangeMutationParams } from './../base';

export class InnerExchangeMutation<T> extends UniformMutation<ListIndividual<T>, List<T>> {
  protected mutateGeneUniformly(individual: ListIndividual<T>, index: number, params: InnerExchangeMutationParams): void {
    const gene: List<T> = individual.get(index);
    const range: NumericRange = new NumericRange(1, gene.length() - 1);
    const firstIndex: number = Generator.generateInteger(range);
    let secondIndex: number = Generator.generateInteger(range);
    while (secondIndex === firstIndex) {
      secondIndex = Generator.generateInteger(range);
    }
    gene.swap(firstIndex, secondIndex);
  }
}