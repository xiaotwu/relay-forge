import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from '@tauri-apps/plugin-notification';
import { enable, disable, isEnabled } from '@tauri-apps/plugin-autostart';
import { Store } from '@tauri-apps/plugin-store';

let draftStore: Store | null = null;

async function getDraftStore(): Promise<Store> {
  if (!draftStore) {
    draftStore = await Store.load('drafts.json');
  }
  return draftStore;
}

interface DesktopState {
  isReady: boolean;
  appVersion: string | null;
  autostartEnabled: boolean;
  notificationsPermitted: boolean;
}

export function useDesktop() {
  const [state, setState] = useState<DesktopState>({
    isReady: false,
    appVersion: null,
    autostartEnabled: false,
    notificationsPermitted: false,
  });

  useEffect(() => {
    async function init() {
      try {
        // Get app version via IPC
        const version = await invoke<string>('get_app_version');

        // Check notification permissions
        let notifPermitted = await isPermissionGranted();
        if (!notifPermitted) {
          const permission = await requestPermission();
          notifPermitted = permission === 'granted';
        }

        // Check autostart status
        const autostart = await isEnabled();

        setState({
          isReady: true,
          appVersion: version,
          autostartEnabled: autostart,
          notificationsPermitted: notifPermitted,
        });
      } catch (err) {
        console.error('Failed to initialize desktop features:', err);
        setState((prev) => ({ ...prev, isReady: true }));
      }
    }

    init();
  }, []);

  const notify = useCallback(
    async (title: string, body?: string) => {
      if (!state.notificationsPermitted) return;
      sendNotification({ title, body });
    },
    [state.notificationsPermitted],
  );

  const setAutostart = useCallback(async (enabled: boolean) => {
    try {
      if (enabled) {
        await enable();
      } else {
        await disable();
      }
      setState((prev) => ({ ...prev, autostartEnabled: enabled }));
    } catch (err) {
      console.error('Failed to toggle autostart:', err);
    }
  }, []);

  const saveDraft = useCallback(async (channelId: string, content: string) => {
    try {
      const store = await getDraftStore();
      await store.set(channelId, content);
      await store.save();
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  }, []);

  const loadDraft = useCallback(async (channelId: string): Promise<string> => {
    try {
      const store = await getDraftStore();
      const draft = await store.get<string>(channelId);
      return draft ?? '';
    } catch {
      return '';
    }
  }, []);

  const clearDraft = useCallback(async (channelId: string) => {
    try {
      const store = await getDraftStore();
      await store.delete(channelId);
      await store.save();
    } catch (err) {
      console.error('Failed to clear draft:', err);
    }
  }, []);

  const hideToTray = useCallback(async () => {
    const appWindow = getCurrentWindow();
    await appWindow.hide();
  }, []);

  const showWindow = useCallback(async () => {
    const appWindow = getCurrentWindow();
    await appWindow.show();
    await appWindow.setFocus();
  }, []);

  return {
    ...state,
    notify,
    setAutostart,
    saveDraft,
    loadDraft,
    clearDraft,
    hideToTray,
    showWindow,
  };
}
