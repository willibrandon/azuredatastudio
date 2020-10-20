/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'mocha';
import * as should from 'should';
import { GreaterThanOrEqualsValidation, IntegerValidation, LessThanOrEqualsValidation, RegexValidation, Validation, ValidationType, ValidationValueType } from '../../../ui/validation/validations';

suite('Validation', () => {
	suite('IntegerValidation', () => {
		// all the below test values are arbitrary representative values or sentinel values for integer validation
		[
			{ value: '342520596781', expected: true },
			{ value: 342520596781, expected: true },
			{ value: '3.14', expected: false },
			{ value: 3.14, expected: false },
			{ value: '3.14e2', expected: true },
			{ value: 3.14e2, expected: true },
			{ value: undefined, expected: false },
			{ value: NaN, expected: false },
		].forEach((testObj) => {
			const displayTestValue = getDisplayString(testObj.value);
			test(`testValue:${displayTestValue}`, async () => {
				const validationDescription = `value: ${displayTestValue} was not an integer`;
				const validation = new IntegerValidation(
					{ type: ValidationType.IsInteger, description: validationDescription },
					async () => testObj.value
				);
				await testAndValidate(validation, testObj, validationDescription);
			});
		});
	});

	suite('RegexValidation', () => {
		const testRegex = '^[0-9]+$';
		// tests
		[
			{ value: '3425205616179816', expected: true },
			{ value: 3425205616179816, expected: true },
			{ value: '3.14', expected: false },
			{ value: 3.14, expected: false },
			{ value: '3.14e2', expected: false },
			{ value: 3.14e2, expected: true }, // value of 3.14e2 literal is 342 which in string matches the testRegex
			{ value: 'arbitraryString', expected: false },
			{ value: undefined, expected: false },
		].forEach(testOb => {
			const displayTestValue = getDisplayString(testOb.value);
			test(`regex: /${testRegex}/, testValue:${displayTestValue}, expect result: ${testOb.expected}`, async () => {
				const validationDescription = `value:${displayTestValue} did not match the regex:/${testRegex}/`;
				const validation = new RegexValidation(
					{ type: ValidationType.IsInteger, description: validationDescription, regex: testRegex },
					async () => testOb.value
				);
				await testAndValidate(validation, testOb, validationDescription);
			});
		});
	});

	suite('LessThanOrEqualsValidation', () => {
		const targetVariableName = 'comparisonTarget';
		// tests - when operands are mix of string and number then number comparison is performed
		[
			// integer values
			{ value: '342', targetValue: '42', expected: true },

			{ value: 342, targetValue: '42', expected: false },
			{ value: '342', targetValue: 42, expected: false },

			{ value: 42, targetValue: '342', expected: true },
			{ value: '42', targetValue: 342, expected: true },
			{ value: 42, targetValue: '42', expected: true },

			{ value: 342, targetValue: 42, expected: false },

			// floating pt values
			{ value: '342.15e-1', targetValue: '42.15e-1', expected: true },
			{ value: 342.15e-1, targetValue: '42.15e-1', expected: false },
			{ value: '342.15e-1', targetValue: 42.15e-1, expected: false },
			{ value: 342.15e-1, targetValue: 42.15e-1, expected: false },

			// equal values
			{ value: '342.15', targetValue: '342.15', expected: true },
			{ value: 342.15, targetValue: '342.15', expected: true },
			{ value: '342.15', targetValue: 342.15, expected: true },
			{ value: 342.15, targetValue: 342.15, expected: true },


			// undefined values - if one operand is undefined result is always false
			{ value: undefined, targetValue: '42', expected: false },
			{ value: undefined, targetValue: 42, expected: false },
			{ value: '42', targetValue: undefined, expected: false },
			{ value: 42, targetValue: undefined, expected: false },
			{ value: undefined, targetValue: undefined, expected: false },

		].forEach(testObj => {
			const displayTestValue = getDisplayString(testObj.value);
			const displayTargetValue = getDisplayString(testObj.targetValue);
			test(`testValue:${displayTestValue}, targetValue:${displayTargetValue}`, async () => {
				const validationDescription = `${displayTestValue} did not test as <= ${displayTargetValue}`;
				const validation = new LessThanOrEqualsValidation(
					{ type: ValidationType.IsInteger, description: validationDescription, target: targetVariableName },
					async () => testObj.value,
					async (_variableName: string) => testObj.targetValue
				);
				await testAndValidate(validation, testObj, validationDescription);
			});
		});
	});

	suite('GreaterThanOrEqualsValidation', () => {
		const targetVariableName = 'comparisonTarget';
		// tests - when operands are mix of string and number then number comparison is performed
		[
			// integer values
			{ value: '342', targetValue: '42', expected: false },
			{ value: 342, targetValue: '42', expected: true },
			{ value: '342', targetValue: 42, expected: true },
			{ value: 342, targetValue: 42, expected: true },

			// floating pt values
			{ value: '342.15e-1', targetValue: '42.15e-1', expected: false },
			{ value: 342.15e-1, targetValue: '42.15e-1', expected: true },
			{ value: '342.15e-1', targetValue: 42.15e-1, expected: true },
			{ value: 342.15e-1, targetValue: 42.15e-1, expected: true },

			// equal values
			{ value: '342.15', targetValue: '342.15', expected: true },
			{ value: 342.15, targetValue: '342.15', expected: true },
			{ value: '342.15', targetValue: 342.15, expected: true },
			{ value: 342.15, targetValue: 342.15, expected: true },

			// undefined values - if one operand is undefined result is always false
			{ value: undefined, targetValue: '42', expected: false },
			{ value: undefined, targetValue: 42, expected: false },
			{ value: '42', targetValue: undefined, expected: false },
			{ value: 42, targetValue: undefined, expected: false },
			{ value: undefined, targetValue: undefined, expected: false },
		].forEach(testObj => {
			const displayTestValue = getDisplayString(testObj.value);
			const displayTargetValue = getDisplayString(testObj.targetValue);
			test(`testValue:${displayTestValue}, targetValue:${displayTargetValue}`, async () => {
				const validationDescription = `${displayTestValue} did not test as >= ${displayTargetValue}`;
				const validation = new GreaterThanOrEqualsValidation(
					{ type: ValidationType.IsInteger, description: validationDescription, target: targetVariableName },
					async () => testObj.value,
					async (_variableName: string) => testObj.targetValue
				);
				await testAndValidate(validation, testObj, validationDescription);
			});
		});
	});
});

interface TestObject {
	value: ValidationValueType;
	targetValue?: ValidationValueType;
	expected: boolean;
}

async function testAndValidate(validation: Validation, test: TestObject, validationDescription: string) {
	const validator = validation.getValidator();
	should(validator).not.be.undefined();
	const validationState = await validator();
	should(validationState.valid).be.equal(test.expected, validationDescription);
	should(validationState.message).be.equal(validationDescription);
}

function getDisplayString(value: string | number | null | undefined) {
	return typeof value === 'string' ? `"${value}"` : value;
}

