/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * Copyright (c) 2020 Francisco Cruz.
 * Copyright (c) 2019 Cristian Abrante.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { ListIndividual, List } from '../../../../../../index';
import MutableIndividualListMock from './MutableIndividualListMock';

interface ListIndividualMock<T> extends MutableIndividualListMock<ListIndividual<T>, T> {
  testName: string;
  creation: {
    data: List<T>[];
    expected: string;
  };
}

export default ListIndividualMock;
