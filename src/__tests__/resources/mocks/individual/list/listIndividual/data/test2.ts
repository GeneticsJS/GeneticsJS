
import { isEqual } from '../../../../../../../index';
import { List } from '../../../../../../../individual';
import { ListIndividual } from '../../../../../../../index'
import ListIndividualMock from '../ListIndividualMock';

const inputData = {
  data: [
    [1, 3, 4],
    [0, 2, 6],
    [2, 6, 7]
  ]
}

const copyExpected = {
  data: [
    [2, 4, 6],
    [0, 3, 7],
    [2, 6, 7]
  ]
}

const otherInputData = [
  [2, 4, 6],
  [0, 3, 7],
  [9, 6, 8]
]

const A = new List<number>();
const B = new List<number>();
const C = new List<number>();
const D = new List<number>();
const E = new List<number>();
const F = new List<number>();

for (let i = 0; i < inputData.data[0].length; i++) {
  A.pushBack(inputData.data[0][i]);
  B.pushBack(inputData.data[1][i]);
  C.pushBack(inputData.data[2][i]);
  D.pushBack(otherInputData[0][i]);
  E.pushBack(otherInputData[1][i]);
  F.pushBack(otherInputData[2][i]);
}

export const I: ListIndividualMock<number> = {
  testName: 'MutableIndividual methods test',
  creation: {
    data: inputData,
    expected: '{ 1 3 4 } { 0 2 6 } { 2 6 7 }',
  },
  expectedGenotype: [A, B, C],
  copy: [
    {
      change: [
        { geneIndex: 0, gene: D },
        { geneIndex: 1, gene: E },
      ],
      other: new ListIndividual(copyExpected),
    },
  ],
  deepCopy: [
    {
      change: [
        { geneIndex: 0, gene: D },
        { geneIndex: 1, gene: E },
      ],
      other: new ListIndividual(copyExpected),
    },
  ],
  copyWithin: [
    {
      expected: [B, B, C],
      params: {
        end: 2,
        start: 1,
        target: 0,
      },
    },
  ],
  every: [
    {
      callback: (gene: List<number>) => {
        return gene.every((x) => {
          return Number.isInteger(x);
        })
      },
      expected: true,
    },
  ],
  fill: [
    {
      expected: [A, E, E],
      params: {
        end: 3,
        gene: E,
        start: 1,
      },
    },
  ],
  find: [
    {
      callback: (gene: List<number>) => {
        return isEqual(gene, B);
      },
      expected: B,
    },
    {
      callback: (gene: List<number>) => {
        return isEqual(gene, C);
      },
      expected: C,
    },
  ],
  findIndex: [
    {
      callback: (gene: List<number>) => {
        return isEqual(gene, B);
      },
      expected: 1,
    },
    {
      callback: (gene: List<number>) => {
        return isEqual(gene, A);
      },
      expected: 0,
    },
    {
      callback: (gene: List<number>) => {
        return isEqual(gene, E);
      },
      expected: -1,
    },
  ],
  get: [
    {
      expected: A,
      params: 0,
    },
    {
      expected: B,
      params: 1,
    },
    {
      expected: C,
      params: 2,
    },
  ],
  includes: [
    {
      expected: true,
      params: { gene: A },
    },
    {
      expected: false,
      params: { gene: E },
    },
    {
      expected: false,
      params: { gene: A, startIndex: 2 },
    },
  ],
  indexOf: [
    {
      expected: 0,
      params: {
        gene: A,
      },
    },
    {
      expected: 2,
      params: {
        gene: C,
      },
    },
    {
      expected: -1,
      params: {
        gene: B,
        startIndex: 2,
      },
    },
  ],
  toStringTest: {
    expected: '{ 1 3 4 } { 0 2 6 } { 2 6 7 }',
  },
};

export default I;