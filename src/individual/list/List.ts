/*
 * @license
 * Copyright (c) 2021 Cristo Navarro.
 * Copyright (c) 2020 Francisco Cruz.
 * Copyright (c) 2019 Cristian Abrante.
 * All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 */

import { isEqual } from '../../index';
import { Node } from './index';

/**
 * Type for callback that express a condition for each node of the list.
 * @typeparam T type of data stored in the nodes
 */
type nodeConditionCallback<T> = (nodeData: T) => boolean;

/**
 * Type for callback executed for each node of the list.
 * @typeparam T type of data stored in the nodes
 */
type nodeCallback<T> = (nodeData: T) => any;

/**
 * ## List
 * Class that represents a simple linked list, composed by Nodes.
 *
 * Lists provide methods to easily insert and extract nodes in any position
 * requiring only the data that is going to be inserted.
 *
 * This class provides some 'array-like' methods for iterating over the nodes
 * and modify or access its data.
 *
 * @typeparam T type of data stored in the nodes
 */
export class List<T> implements Iterable<T> {
  /**
   * First node of the list.
   */
  private headNode: Node<T> | null;
  /**
   * Current size of the list.
   */
  private listSize: number;

  /**
   * Constructor of the class.
   * If data is given, then it creates a node with it and set it to be the first
   * of the list.
   * If no data is given, the head fo the list is set to null.
   * @param headData Data to initialize the first node
   */
  constructor(headData?: T) {
    if (headData) {
      this.headNode = new Node<T>(headData);
      this.listSize = 1;
    } else {
      this.headNode = null;
      this.listSize = 0;
    }
  }

  /**
   * Getter to the first node.
   * If the head is not null, it returns the data of the node. If it is null,
   * null is returned instead.
   * @return Data of the first node or null.
   */
  get front(): T | null {
    if (this.headNode) {
      return this.headNode.data;
    }
    return null;
  }

  /**
   * Getter to the last node.
   * If the head is not null, it returns the data of the last node. If it is
   * null, null is returned instead.
   * @return Data of the last node or null.
   */
  get back(): T | null {
    if (this.headNode) {
      let current: Node<T> = this.headNode;
      while (current.next !== null) {
        current = current.next;
      }
      return current.data;
    }
    return null;
  }

  /**
   * Getter of the data of all the nodes.
   * @return Array with the data of every node.
   */
  get values(): T[] {
    const values: T[] = [];
    for (const nodeData of this) {
      values.push(nodeData);
    }
    return values;
  }

  /**
   * Checks if the list is empty.
   * @return True if it is empty, false if not.
   */
  public empty(): boolean {
    return this.listSize === 0;
  }

  /**
   * Access the data of the node in the given position.
   * If the position is out of the range of the list, it throws an error.
   * @param pos Position of the node in the list
   * @return Data of the node.
   */
  public get(pos: number): T {
    let currentPos: number = 0;
    let currentNode: Node<T> | null = this.headNode;
    while (currentNode !== null) {
      if (currentPos === pos) {
        return currentNode.data;
      }
      currentPos++;
      currentNode = currentNode.next;
    }
    throw new RangeError(`Given position (${pos}) is out of list range.`);
  }

  /**
   * Inserts a node with the given data at the beginning of the list.
   * @param newData Data to insert
   */
  public pushFront(newData: T): void {
    const newHead = new Node<T>(newData);
    newHead.next = this.headNode;
    this.headNode = newHead;
    this.listSize++;
  }

  /**
   * Erases the first node of the list.
   * If the list is empty, it throws an error.
   */
  public popFront(): void {
    if (this.headNode === null) {
      throw new Error('List is empty.');
    } else {
      this.headNode = this.headNode.next;
      this.listSize--;
    }
  }

  /**
   * Inserts a node with the given data at the end of the list.
   * @param newData Data to insert
   */
  public pushBack(newData: T): void {
    const newNode = new Node<T>(newData);
    let current: Node<T> | null = this.headNode;
    if (current === null) {
      this.headNode = newNode;
    } else {
      while (current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.listSize++;
  }

  /**
   * Erases the last node of the list.
   * If the list is empty, it throws an error.
   */
  public popBack(): void {
    if (this.headNode === null) {
      throw new Error('List is empty.');
    } else {
      if (this.listSize === 1) {
        this.headNode = null;
        this.listSize--;
      } else {
        let currentNode: Node<T> | null = this.headNode.next;
        let previousNode: Node<T> | null = this.headNode;
        while (currentNode !== null && previousNode !== null) {
          if (currentNode.next === null) {
            previousNode.next = null;
            this.listSize--;
            return;
          }
          currentNode = currentNode.next;
          previousNode = previousNode.next;
        }
      }
    }
  }

  /**
   * Inserts a new node with the given data in the selected position.
   * If the position is out of the range of the list, an error is thrown.
   * @param pos Posisiton to insert the node
   * @param newData Data of the new node
   */
  public insert(pos: number, newData: T): void {
    if (pos > this.listSize || pos < 0) {
      throw new RangeError(`Given position (${pos}) is out of list range.`);
    }
    const newNode = new Node<T>(newData);
    if (this.headNode === null) {
      this.headNode = newNode;
    } else {
      if (pos === 0) {
        newNode.next = this.headNode;
        this.headNode = newNode;
        this.listSize++;
      } else if (pos === this.listSize) {
        this.pushBack(newData);
      } else {
        let currentPos: number = 0;
        let currentNode: Node<T> | null = this.headNode;
        while (currentNode !== null) {
          if (currentPos === pos - 1) {
            newNode.next = currentNode.next;
            currentNode.next = newNode;
            this.listSize++;
            return;
          }
          currentPos++;
          currentNode = currentNode.next;
        }
      }
    }
  }

  /**
   * Erases the node at the given position.
   * If the list is empty or the position is out of the range of the list, it
   * throws an error.
   * @param pos Position of the node to be erased
   */
  public erase(pos: number): void {
    if (pos >= this.listSize || pos < 0) {
      throw new RangeError(`Given position (${pos}) is out of list range.`);
    }
    if (this.headNode === null) {
      throw new Error('List is empty.');
    } else {
      if (pos === 0) {
        this.headNode = this.headNode.next;
        this.listSize--;
      } else {
        let currentPos: number = 0;
        let currentNode: Node<T> | null = this.headNode;
        while (currentNode !== null) {
          if (currentPos === pos - 1) {
            if (currentNode.next !== null) {
              currentNode.next = currentNode.next.next;
            } else {
              currentNode.next = null;
            }
            this.listSize--;
            return;
          }
          currentPos++;
          currentNode = currentNode.next;
        }
      }
    }
  }

  /**
   * Lists are iterable, so this method returns an iterator.
   * @return Iterator over the nodes of the list.
   */
  public [Symbol.iterator](): Iterator<T> {
    let current: Node<T> | null = this.headNode;
    return {
      next(): IteratorResult<T, any> {
        if (current === null) {
          return { done: true, value: null };
        } else {
          const result = { done: false, value: current.data };
          current = current.next;
          return result;
        }
      },
    };
  }

  /**
   * Gets the current size of the list.
   * @return Size of the list.
   */
  public length(): number {
    return this.listSize;
  }

  /**
   * Returns a boolean that is true if every node satisfies the specified
   * condition in the callback function.
   * @param callback Specifies a condition for every node
   * @return True if all nodes accept the condition.
   */
  public every(callback: nodeConditionCallback<T>): boolean {
    for (const current of this) {
      if (!callback(current)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the data of the node that satisfies the condition specified in the
   * callback function. If there isn't a node that accept it, undefined is
   * returned instead.
   * @param callback Specifies the condition that a node must satisfy
   * @return Data of the node that accepts the condition or undefined.
   */
  public find(callback: nodeConditionCallback<T>): T | undefined {
    for (const current of this) {
      if (callback(current)) {
        return current;
      }
    }
  }

  /**
   * Returns the index of the node that satisfies the condition specified in the
   * callback function. If there isn't a node that accept it, undefined is
   * returned instead.
   * @param callback Specifies the condition that a node must satisfy
   * @return Index of the node that accepts the condition or undefined.
   */
  public findIndex(callback: nodeConditionCallback<T>): number | undefined {
    let index: number = 0;
    for (const current of this) {
      if (callback(current)) {
        return index;
      }
      index++;
    }
  }

  /**
   * Executes the specified function for every node of the list.
   * @param callback Function to be executed
   */
  public forEach(callback: nodeCallback<T>): void {
    for (const current of this) {
      callback(current);
    }
  }

  /**
   * Returns a boolean that is true if there is a node in the list that has
   * the same data as which is given.
   * @param data Data to compare
   * @return True if there is a node with the same data, false if not.
   */
  public includes(data: T): boolean {
    for (const current of this) {
      if (isEqual(current, data)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the index of the first node that has the same data as the specified
   * one. If there isn't a node with the same sata, it returns -1.
   * @param data Data of the wanted node
   * @return Index of the wanted node or -1.
   */
  public indexOf(data: T): number {
    let index = 0;
    for (const current of this) {
      if (isEqual(current, data)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  /**
   * Returns the index of the last node that has the same data as the specified
   * one. If there isn't a node with the same sata, it returns -1.
   * @param data Data of the wanted node
   * @return Index of the wanted node or -1.
   */
  public lastIndexOf(data: T): number {
    let dataIndex = -1;
    let currentIndex = 0;
    for (const current of this) {
      if (isEqual(current, data)) {
        dataIndex = currentIndex;
      }
      currentIndex++;
    }
    return dataIndex;
  }

  /**
   * Tests if there is any node that satisfies the specified condition in the
   * callback function.
   * @param callback Specifies the condition for the nodes
   * @return True if there is any node that satisfies the condition
   */
  public some(callback: nodeConditionCallback<T>): boolean {
    for (const current of this) {
      if (callback(current)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Converts the list to a string.
   * @return String that represents the list.
   */
  public toString(): string {
    let result = '{ ';
    this.forEach(x => {
      result += x + ' ';
    });
    result += '}';
    return result;
  }

  /**
   * Swap two nodes from the list with the specified positions.
   * @param firstIndex Index of the first node to swap
   * @param secondIndex Index of the second node to swap
   */
  public swap(firstIndex: number, secondIndex: number): void {
    const firstData: T = this.get(firstIndex);
    const secondData: T = this.get(secondIndex);
    this.insert(firstIndex, secondData);
    this.erase(firstIndex + 1);
    this.insert(secondIndex, firstData);
    this.erase(secondIndex + 1);
  }

  /**
   * Swaps the node in the given position with a new one that has the scpecified
   * data.
   * @param index Position of the node to change
   * @param data Data for the new node
   */
  public swapWith(index: number, data: T): void {
    this.insert(index, data);
    this.erase(index + 1);
  }
}
