import React, { useState, useEffect } from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  YStack, 
  XStack, 
  Text, 
  Button, 
  Card, 
  Separator,
  Switch,
  H2,
  H3,
  Paragraph
} from 'tamagui';
import { Database, Play, CheckCircle, AlertTriangle } from '@tamagui/lucide-icons';

import { client } from '../lib/appwrite';
import { createDatabaseInitializer, quickDatabaseCheck, COLLECTION_SCHEMAS } from '../lib/database-init';
import { DatabaseError, DatabaseErrorHandler } from '../lib/database-errors';
import DatabaseStatus from '../components/DatabaseStatus';

export default function DatabaseTestScreen() {
  const [databaseId] = useState(process.env.EXPO_PUBLIC_DATABASE_ID || 'farmquest_db');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showDetails, setShowDetails] = useState(true);

  const addTestResult = (test: string, success: boolean, message: string, details?: any) => {
    const result = {
      id: Date.now(),
      test,
      success,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
    setTestResults(prev => [result, ...prev]);
    return result;
  };

  const runBasicConnectivityTest = async () => {
    try {
      addTestResult('Database Connectivity', false, 'Testing connection...', { status: 'running' });
      
      const result = await quickDatabaseCheck(client, databaseId);
      
      addTestResult(
        'Database Connectivity',
        true,
        `Connection successful: ${result.message}`,
        result.details
      );
      
      return result;
    } catch (error: any) {
      const dbError = error instanceof DatabaseError 
        ? error 
        : DatabaseErrorHandler.parseAppwriteError(error);
      
      addTestResult(
        'Database Connectivity',
        false,
        `Connection failed: ${DatabaseErrorHandler.getUserFriendlyMessage(dbError)}`,
        { error: dbError.message, code: dbError.code }
      );
      
      throw dbError;
    }
  };

  const runCollectionExistenceTest = async () => {
    try {
      addTestResult('Collection Existence', false, 'Checking collections...', { status: 'running' });
      
      const initializer = createDatabaseInitializer(client, databaseId);
      const status = await initializer.checkCollectionsStatus();
      
      const success = status.allExist;
      const message = success 
        ? `All ${status.existing.length} collections exist`
        : `${status.missing.length} collections missing: ${status.missing.join(', ')}`;
      
      addTestResult('Collection Existence', success, message, status);
      
      return status;
    } catch (error: any) {
      const dbError = error instanceof DatabaseError 
        ? error 
        : DatabaseErrorHandler.parseAppwriteError(error);
      
      addTestResult(
        'Collection Existence',
        false,
        `Check failed: ${DatabaseErrorHandler.getUserFriendlyMessage(dbError)}`,
        { error: dbError.message, code: dbError.code }
      );
      
      throw dbError;
    }
  };

  const runCollectionValidationTest = async () => {
    try {
      addTestResult('Collection Validation', false, 'Validating collection structures...', { status: 'running' });
      
      const initializer = createDatabaseInitializer(client, databaseId);
      const validationResults: any[] = [];
      
      for (const collectionId of Object.keys(COLLECTION_SCHEMAS)) {
        try {
          const exists = await initializer.collectionExists(collectionId);
          if (exists) {
            const validation = await initializer.validateCollectionStructure(collectionId);
            validationResults.push({
              collectionId,
              name: COLLECTION_SCHEMAS[collectionId].name,
              valid: validation.valid,
              issues: validation.issues,
            });
          } else {
            validationResults.push({
              collectionId,
              name: COLLECTION_SCHEMAS[collectionId].name,
              valid: false,
              issues: ['Collection does not exist'],
            });
          }
        } catch (error: any) {
          validationResults.push({
            collectionId,
            name: COLLECTION_SCHEMAS[collectionId].name,
            valid: false,
            issues: [`Validation error: ${error.message}`],
          });
        }
      }
      
      const allValid = validationResults.every(r => r.valid);
      const invalidCount = validationResults.filter(r => !r.valid).length;
      
      const message = allValid 
        ? 'All collections are valid'
        : `${invalidCount} collections have validation issues`;
      
      addTestResult('Collection Validation', allValid, message, validationResults);
      
      return validationResults;
    } catch (error: any) {
      const dbError = error instanceof DatabaseError 
        ? error 
        : DatabaseErrorHandler.parseAppwriteError(error);
      
      addTestResult(
        'Collection Validation',
        false,
        `Validation failed: ${DatabaseErrorHandler.getUserFriendlyMessage(dbError)}`,
        { error: dbError.message, code: dbError.code }
      );
      
      throw dbError;
    }
  };

  const runErrorHandlingTest = async () => {
    try {
      addTestResult('Error Handling', false, 'Testing error scenarios...', { status: 'running' });
      
      const initializer = createDatabaseInitializer(client, databaseId);
      const errorTests: any[] = [];
      
      // Test invalid collection ID
      try {
        await initializer.collectionExists('');
        errorTests.push({ test: 'Empty collection ID', handled: false, error: 'No error thrown' });
      } catch (error: any) {
        errorTests.push({ 
          test: 'Empty collection ID', 
          handled: error.name === 'ValidationError',
          error: error.message 
        });
      }
      
      // Test non-existent collection
      try {
        const exists = await initializer.collectionExists('non_existent_collection_12345');
        errorTests.push({ 
          test: 'Non-existent collection', 
          handled: !exists, // Should return false, not throw
          error: exists ? 'Incorrectly returned true' : 'Correctly returned false'
        });
      } catch (error: any) {
        errorTests.push({ 
          test: 'Non-existent collection', 
          handled: false,
          error: `Unexpected error: ${error.message}`
        });
      }
      
      const allHandled = errorTests.every(t => t.handled);
      const message = allHandled 
        ? 'All error scenarios handled correctly'
        : `${errorTests.filter(t => !t.handled).length} error scenarios not handled properly`;
      
      addTestResult('Error Handling', allHandled, message, errorTests);
      
      return errorTests;
    } catch (error: any) {
      addTestResult(
        'Error Handling',
        false,
        `Error handling test failed: ${error.message}`,
        { error: error.message }
      );
      
      throw error;
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    try {
      // Run tests in sequence
      await runBasicConnectivityTest();
      await runCollectionExistenceTest();
      await runCollectionValidationTest();
      await runErrorHandlingTest();
      
      addTestResult(
        'Test Suite Complete',
        true,
        'All tests completed successfully',
        { totalTests: 4, timestamp: new Date().toISOString() }
      );
    } catch (error) {
      addTestResult(
        'Test Suite Failed',
        false,
        'Test suite stopped due to critical error',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    } finally {
      setIsRunningTests(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const handleDatabaseStatusChange = (status: { ready: boolean; message: string }) => {
    console.log('Database status changed:', status);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
      <ScrollView style={{ flex: 1 }}>
        <YStack padding="$4" space="$4">
          <YStack space="$2">
            <H2>Database Test Suite</H2>
            <Paragraph color="$color11">
              Test the automatic Appwrite database collection creation and validation functionality.
            </Paragraph>
          </YStack>

          {/* Database Status Component */}
          <YStack space="$2">
            <H3>Live Database Status</H3>
            <DatabaseStatus
              databaseId={databaseId}
              onStatusChange={handleDatabaseStatusChange}
              showDetails={showDetails}
              autoRefresh={autoRefresh}
              refreshInterval={15000}
            />
            
            <XStack space="$3" alignItems="center">
              <XStack alignItems="center" space="$2">
                <Switch
                  checked={showDetails}
                  onCheckedChange={setShowDetails}
                />
                <Text>Show Details</Text>
              </XStack>
              
              <XStack alignItems="center" space="$2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Text>Auto Refresh</Text>
              </XStack>
            </XStack>
          </YStack>

          <Separator />

          {/* Test Controls */}
          <YStack space="$3">
            <H3>Test Controls</H3>
            <XStack space="$3">
              <Button
                flex={1}
                onPress={runAllTests}
                disabled={isRunningTests}
                icon={Play}
              >
                {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              
              <Button
                variant="outlined"
                onPress={clearResults}
                disabled={isRunningTests}
              >
                Clear Results
              </Button>
            </XStack>
          </YStack>

          {/* Test Results */}
          {testResults.length > 0 && (
            <YStack space="$3">
              <H3>Test Results</H3>
              {testResults.map((result) => (
                <Card key={result.id} padding="$3" borderRadius="$4">
                  <XStack alignItems="center" justifyContent="space-between">
                    <XStack alignItems="center" space="$3" flex={1}>
                      {result.success ? (
                        <CheckCircle size={20} color="$green10" />
                      ) : (
                        <AlertTriangle size={20} color="$red10" />
                      )}
                      <YStack flex={1}>
                        <Text fontSize="$4" fontWeight="600" color="$color12">
                          {result.test}
                        </Text>
                        <Text fontSize="$3" color="$color11">
                          {result.message}
                        </Text>
                        <Text fontSize="$2" color="$color10">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </Text>
                      </YStack>
                    </XStack>
                  </XStack>
                  
                  {result.details && (
                    <YStack marginTop="$3" space="$2">
                      <Separator />
                      <Text fontSize="$2" color="$color10" fontFamily="$mono">
                        {JSON.stringify(result.details, null, 2)}
                      </Text>
                    </YStack>
                  )}
                </Card>
              ))}
            </YStack>
          )}

          {/* Collection Schema Info */}
          <YStack space="$3">
            <H3>Expected Collections</H3>
            <Card padding="$3">
              <YStack space="$2">
                {Object.entries(COLLECTION_SCHEMAS).map(([id, schema]) => (
                  <XStack key={id} alignItems="center" justifyContent="space-between">
                    <YStack flex={1}>
                      <Text fontSize="$3" fontWeight="600">{schema.name}</Text>
                      <Text fontSize="$2" color="$color10">{id}</Text>
                    </YStack>
                    <Text fontSize="$2" color="$color11">
                      {schema.attributes.length} attributes
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </Card>
          </YStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}