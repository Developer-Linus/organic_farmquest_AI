import React, { useState, useEffect } from 'react';
import { Text, ActivityIndicator, Alert } from 'react-native';
import { styled } from '@tamagui/core';
import { Card, Button, XStack, YStack, Separator } from 'tamagui';
import { CheckCircle, AlertCircle, XCircle, RefreshCw, Database } from '@tamagui/lucide-icons';

import { client } from '../lib/appwrite';
import { createDatabaseInitializer, quickDatabaseCheck } from '../lib/database-init';
import { DatabaseError, DatabaseErrorHandler } from '../lib/database-errors';

const StatusCard = styled(Card, {
  padding: '$4',
  margin: '$2',
  borderRadius: '$4',
  variants: {
    status: {
      complete: {
        borderColor: '$green8',
        backgroundColor: '$green2',
      },
      partial: {
        borderColor: '$orange8',
        backgroundColor: '$orange2',
      },
      missing: {
        borderColor: '$red8',
        backgroundColor: '$red2',
      },
      error: {
        borderColor: '$red8',
        backgroundColor: '$red2',
      },
      loading: {
        borderColor: '$blue8',
        backgroundColor: '$blue2',
      },
    },
  },
});

const StatusIcon = ({ status }: { status: string }) => {
  const iconProps = { size: 20 };
  
  switch (status) {
    case 'complete':
      return <CheckCircle {...iconProps} color="$green10" />;
    case 'partial':
      return <AlertCircle {...iconProps} color="$orange10" />;
    case 'missing':
    case 'error':
      return <XCircle {...iconProps} color="$red10" />;
    case 'loading':
      return <ActivityIndicator size="small" color="$blue10" />;
    default:
      return <Database {...iconProps} color="$gray10" />;
  }
};

interface DatabaseStatusProps {
  databaseId: string;
  onStatusChange?: (status: { ready: boolean; message: string }) => void;
  showDetails?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const DatabaseStatus: React.FC<DatabaseStatusProps> = ({
  databaseId,
  onStatusChange,
  showDetails = false,
  autoRefresh = false,
  refreshInterval = 30000, // 30 seconds
}) => {
  const [status, setStatus] = useState<{
    ready: boolean;
    message: string;
    details?: any;
    loading: boolean;
    error?: DatabaseError;
  }>({
    ready: false,
    message: 'Checking database status...',
    loading: true,
  });

  const [detailedStatus, setDetailedStatus] = useState<any>(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  const checkDatabaseStatus = async (showLoading = true) => {
    try {
      if (showLoading) {
        setStatus(prev => ({ ...prev, loading: true, error: undefined }));
      }

      const result = await quickDatabaseCheck(client, databaseId);
      
      const newStatus = {
        ready: result.ready,
        message: result.message,
        details: result.details,
        loading: false,
        error: undefined,
      };

      setStatus(newStatus);
      onStatusChange?.(result);

      // Get detailed status if requested
      if (showDetails) {
        try {
          const initializer = createDatabaseInitializer(client, databaseId);
          const detailed = await initializer.getStatusReport();
          setDetailedStatus(detailed);
        } catch (error) {
          console.warn('Failed to get detailed status:', error);
        }
      }
    } catch (error: any) {
      const dbError = error instanceof DatabaseError 
        ? error 
        : DatabaseErrorHandler.parseAppwriteError(error);

      DatabaseErrorHandler.logError(dbError, 'DatabaseStatus.checkDatabaseStatus');

      const errorStatus = {
        ready: false,
        message: DatabaseErrorHandler.getUserFriendlyMessage(dbError),
        loading: false,
        error: dbError,
      };

      setStatus(errorStatus);
      onStatusChange?.({ ready: false, message: errorStatus.message });
    }
  };

  const handleRefresh = () => {
    checkDatabaseStatus(true);
  };

  const handleShowDetails = () => {
    setShowDetailedView(!showDetailedView);
    if (!showDetailedView && !detailedStatus) {
      checkDatabaseStatus(false);
    }
  };

  const handleRetry = () => {
    if (status.error && DatabaseErrorHandler.isRecoverable(status.error)) {
      checkDatabaseStatus(true);
    } else {
      Alert.alert(
        'Database Error',
        'This error requires manual intervention. Please contact support or check your configuration.',
        [{ text: 'OK' }]
      );
    }
  };

  useEffect(() => {
    checkDatabaseStatus(true);
  }, [databaseId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      checkDatabaseStatus(false);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getStatusType = () => {
    if (status.loading) return 'loading';
    if (status.error) return 'error';
    if (status.ready) return 'complete';
    if (status.details?.existing > 0) return 'partial';
    return 'missing';
  };

  return (
    <YStack space="$2">
      <StatusCard status={getStatusType()}>
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" space="$3" flex={1}>
            <StatusIcon status={getStatusType()} />
            <YStack flex={1}>
              <Text fontSize="$4" fontWeight="600" color="$color12">
                Database Status
              </Text>
              <Text fontSize="$3" color="$color11" numberOfLines={2}>
                {status.message}
              </Text>
            </YStack>
          </XStack>
          
          <XStack space="$2">
            {status.error && DatabaseErrorHandler.isRecoverable(status.error) && (
              <Button
                size="$3"
                variant="outlined"
                onPress={handleRetry}
                disabled={status.loading}
              >
                Retry
              </Button>
            )}
            
            <Button
              size="$3"
              variant="outlined"
              onPress={handleRefresh}
              disabled={status.loading}
              icon={RefreshCw}
            >
              {status.loading ? <ActivityIndicator size="small" /> : null}
            </Button>
            
            {showDetails && (
              <Button
                size="$3"
                variant="outlined"
                onPress={handleShowDetails}
              >
                {showDetailedView ? 'Hide' : 'Details'}
              </Button>
            )}
          </XStack>
        </XStack>

        {status.details && (
          <YStack marginTop="$3" space="$2">
            <Separator />
            <XStack justifyContent="space-between">
              <Text fontSize="$2" color="$color10">Collections:</Text>
              <Text fontSize="$2" color="$color10">
                {status.details.existing}/{status.details.total} ready
              </Text>
            </XStack>
            
            {status.details.errors > 0 && (
              <Text fontSize="$2" color="$red10">
                {status.details.errors} error(s) detected
              </Text>
            )}
          </YStack>
        )}
      </StatusCard>

      {showDetailedView && detailedStatus && (
        <StatusCard status="complete">
          <YStack space="$3">
            <Text fontSize="$4" fontWeight="600" color="$color12">
              Collection Details
            </Text>
            
            {Object.entries(detailedStatus.details.collections).map(([id, info]: [string, any]) => (
              <XStack key={id} alignItems="center" justifyContent="space-between">
                <XStack alignItems="center" space="$2" flex={1}>
                  <StatusIcon status={info.exists ? 'complete' : 'missing'} />
                  <YStack flex={1}>
                    <Text fontSize="$3" color="$color12">{info.name}</Text>
                    <Text fontSize="$2" color="$color10">{id}</Text>
                    {info.error && (
                      <Text fontSize="$2" color="$red10">{info.error}</Text>
                    )}
                  </YStack>
                </XStack>
                <Text fontSize="$2" color={info.exists ? '$green10' : '$red10'}>
                  {info.exists ? 'Ready' : 'Missing'}
                </Text>
              </XStack>
            ))}
          </YStack>
        </StatusCard>
      )}
    </YStack>
  );
};

export default DatabaseStatus;