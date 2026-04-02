import React, { useState } from 'react';
import { Button, Input } from '@relayforge/ui';
import { useToast } from '@relayforge/ui';
import { ApiClient } from '@relayforge/sdk';
import { API_BASE_URL } from '@relayforge/config';

interface SystemSettings {
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  maxUploadSizeMB: number;
  rateLimitRequestsPerMinute: number;
  rateLimitBurstSize: number;
  maintenanceMode: boolean;
}

export function SystemSettingsPage() {
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxUploadSizeMB: 25,
    rateLimitRequestsPerMinute: 60,
    rateLimitBurstSize: 10,
    maintenanceMode: false,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const client = new ApiClient({
        baseURL: API_BASE_URL,
        onTokenRefresh: () => {},
        onAuthError: () => {},
      });
      const token = localStorage.getItem('rf_admin_token');
      if (token) client.setTokens(token, '');

      await client.post('/admin/settings', settings);
      addToast('success', 'Settings saved successfully');
    } catch {
      addToast('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggle = (key: keyof SystemSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-text-primary text-2xl font-bold">System Settings</h1>
        <p className="text-text-secondary mt-1 text-sm">Configure platform-wide settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Registration */}
        <div className="bg-surface border-border space-y-5 rounded-xl border p-5">
          <h2 className="text-text-primary text-lg font-semibold">User Registration</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-medium">Registration Enabled</p>
              <p className="text-text-secondary text-xs">Allow new users to create accounts</p>
            </div>
            <button
              onClick={() => toggle('registrationEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.registrationEnabled ? 'bg-accent' : 'bg-elevated'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.registrationEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-medium">Email Verification Required</p>
              <p className="text-text-secondary text-xs">
                Require email verification before account activation
              </p>
            </div>
            <button
              onClick={() => toggle('emailVerificationRequired')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailVerificationRequired ? 'bg-accent' : 'bg-elevated'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailVerificationRequired ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Upload limits */}
        <div className="bg-surface border-border space-y-5 rounded-xl border p-5">
          <h2 className="text-text-primary text-lg font-semibold">File Uploads</h2>

          <div className="max-w-xs">
            <Input
              label="Max Upload Size (MB)"
              type="number"
              min={1}
              max={100}
              value={String(settings.maxUploadSizeMB)}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  maxUploadSizeMB: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>
        </div>

        {/* Rate limiting */}
        <div className="bg-surface border-border space-y-5 rounded-xl border p-5">
          <h2 className="text-text-primary text-lg font-semibold">Rate Limiting</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Requests per Minute"
              type="number"
              min={10}
              max={1000}
              value={String(settings.rateLimitRequestsPerMinute)}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  rateLimitRequestsPerMinute: parseInt(e.target.value, 10) || 10,
                }))
              }
            />
            <Input
              label="Burst Size"
              type="number"
              min={1}
              max={100}
              value={String(settings.rateLimitBurstSize)}
              onChange={(e) =>
                setSettings((prev) => ({
                  ...prev,
                  rateLimitBurstSize: parseInt(e.target.value, 10) || 1,
                }))
              }
            />
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-surface border-border space-y-5 rounded-xl border p-5">
          <h2 className="text-text-primary text-lg font-semibold">Maintenance</h2>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary text-sm font-medium">Maintenance Mode</p>
              <p className="text-text-secondary text-xs">
                Display a maintenance page to all non-admin users
              </p>
            </div>
            <button
              onClick={() => toggle('maintenanceMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-red-500' : 'bg-elevated'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            loading={saving}
            className="!bg-accent hover:!bg-accent-hover px-8"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
