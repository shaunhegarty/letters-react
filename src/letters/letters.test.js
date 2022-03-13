import {stringContainsChars, strOfParticularLength, lettersAllowed, letterDistribution} from './letters.js';

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

test('letters are limited correctly', () => {
  expect(lettersAllowed(0.7, 4, 9)).toEqual(true);
  expect(lettersAllowed(0.7, 5, 9)).toEqual(true);
  expect(lettersAllowed(0.7, 6, 9)).toEqual(false);
  expect(lettersAllowed(0.7, 7, 9)).toEqual(false);

  expect(lettersAllowed(0.6, 4, 9)).toEqual(true);
  expect(lettersAllowed(0.6, 5, 9)).toEqual(false);
  expect(lettersAllowed(0.6, 6, 9)).toEqual(false);
  expect(lettersAllowed(0.6, 7, 9)).toEqual(false);
})

test('letter distributions are formed correctly', () => {
  let dist = {"A": 3, "B": 2}
  expect(letterDistribution(dist)).toEqual('AAABB')
  dist = {"A": 0, "B": 2, "C": 3}
  expect(letterDistribution(dist)).toEqual('BBCCC')
})