'use client';

import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useToast } from '../../hooks/use-toast';
import { Copy, Users } from 'lucide-react';

interface SessionManagerProps {
  onSessionStart: (sessionId: string) => void;
  onMatchFound: (restaurant: any) => void;
}

export function SessionManager({ onSessionStart, onMatchFound }: SessionManagerProps) {
  const [sessionId, setSessionId] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const { toast } = useToast();

  const generateSessionId = async () => {
    setIsCreating(true);
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: code,
          action: 'create',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      setSessionId(code);
      setIsHost(true);
      onSessionStart(code);
      toast({
        title: 'Session Created',
        description: 'Share the code with your friend to start matching',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create session',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const validateSession = async (code: string) => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: code,
          action: 'validate',
        }),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.exists;
    } catch (err) {
      return false;
    }
  };

  const joinSession = async () => {
    if (!inputCode || inputCode.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid 6-character session code',
        variant: 'destructive',
      });
      return;
    }

    setIsJoining(true);
    
    try {
      // First validate if the session exists
      const exists = await validateSession(inputCode);
      
      if (!exists) {
        toast({
          title: 'Invalid Session',
          description: 'No session found with this code',
          variant: 'destructive',
        });
        setIsJoining(false);
        return;
      }

      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: inputCode,
          action: 'join',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to join session');
      }

      setSessionId(inputCode);
      onSessionStart(inputCode);
      toast({
        title: 'Session Joined',
        description: 'You are now connected to the session',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to join session',
        variant: 'destructive',
      });
    } finally {
      setIsJoining(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionId);
    toast({
      title: 'Code Copied',
      description: 'Session code copied to clipboard',
    });
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Restaurant Matching Session</h2>
        </div>

        {!sessionId ? (
          <div className="space-y-0">
            <Button
              onClick={generateSessionId}
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? 'Creating Session...' : <span className="text-lg font-medium">Create New Session</span>}
            </Button>
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-start">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center pt-8">
                <span className="bg-background px-2 text-xs uppercase text-muted-foreground">
                  Or join existing
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Enter 6-digit code"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center tracking-widest"
              />
              <Button
                onClick={joinSession}
                variant="secondary"
                disabled={isJoining || inputCode.length !== 6}
              >
                {isJoining ? 'Joining...' : 'Join'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isHost ? 'Share this code with your friend' : 'Connected to session'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-mono tracking-wider bg-muted px-4 py-2 rounded">
                  {sessionId}
                </code>
                {isHost && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}