import { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Alert,
} from '@mantine/core';
import { IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth-context';
import { Logo } from '../components/logo/logo';
import { RoutePath } from '../routes';

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || RoutePath.HOME;

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t('login.invalidPassword'));
        return;
      }

      const { token } = await res.json();
      login(token);
      navigate(from, { replace: true });
    } catch {
      setError(t('login.cannotConnect'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center style={{ minHeight: '100vh', background: 'var(--mantine-color-body)' }}>
      <Paper shadow="md" radius="md" p="xl" w={360} withBorder>
        <Stack gap="lg" align="center">
          <Logo />
          <Stack gap={4} align="center">
            <IconLock size={32} color="var(--mantine-color-koinsight-8)" />
            <Text size="lg" fw={600}>{t('login.passwordRequired')}</Text>
            <Text size="sm" c="dimmed" ta="center">
              {t('login.enterPassword')}
            </Text>
          </Stack>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" w="100%">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} w="100%">
            <Stack gap="md">
              <PasswordInput
                id="password"
                label={t('login.password')}
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                required
                data-autofocus
              />
              <Button type="submit" fullWidth loading={loading} id="login-submit">
                {t('login.signIn')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Center>
  );
}
