import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import {stringContainsChars, strOfParticularLength} from './letters.js';

test('characters are in mix', () => {
  expect(stringContainsChars('abc', 'abc')).toEqual(true);
  expect(stringContainsChars('abcde', 'abc')).toEqual(true);
  expect(stringContainsChars('abc', 'cab')).toEqual(true);
  expect(stringContainsChars('ebcda', 'cab')).toEqual(true);
  expect(stringContainsChars('oooaaa', 'aoaoa')).toEqual(true);
})

test('characters are not in mix', () => {
  expect(stringContainsChars('abc', 'dog')).toEqual(false);
  expect(stringContainsChars('abc', 'abcde')).toEqual(false);
  expect(stringContainsChars('cab', 'ebcda')).toEqual(false);
  expect(stringContainsChars('longmixture', 'loongmix')).toEqual(false);
  expect(stringContainsChars('oooaa', 'aaao')).toEqual(false);
})

test('strings have the correct length', () => {
  expect(strOfParticularLength('abcde', 8)).toEqual('abcde   ');
  expect(strOfParticularLength('abcde', 5)).toEqual('abcde');
  expect(strOfParticularLength('abcde', 2)).toEqual('ab');
  expect(strOfParticularLength('abcde', 0)).toEqual('');
  expect(strOfParticularLength('', 9)).toEqual('         ');
})