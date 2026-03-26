import {
  ActionIcon,
  Box,
  Flex,
  Menu,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBooks,
  IconCalendar,
  IconChartBar,
  IconDownload,
  IconLanguage,
  IconMoon,
  IconReload,
  IconSun,
} from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { RoutePath } from '../../routes';
import { Logo } from '../logo/logo';
import { DownloadPluginModal } from './download-plugin';
import { UploadForm } from './upload-form';

import style from './navbar.module.css';

export function Navbar({ onNavigate }: { onNavigate?: () => void }): JSX.Element {
  const { pathname } = useLocation();
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();
  const { t, i18n } = useTranslation();

  const toggleColorScheme = () => {
    setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark');
  };

  const [downloadOpened, { close: closeDownload, open: openDownload }] = useDisclosure(false);

  const tabs = [
    { link: RoutePath.BOOKS, label: t('nav.books'), icon: IconBooks },
    { link: RoutePath.CALENDAR, label: t('nav.calendar'), icon: IconCalendar },
    { link: RoutePath.STATS, label: t('nav.stats'), icon: IconChartBar },
    { link: RoutePath.SYNCS, label: t('nav.syncs'), icon: IconReload },
    { onClick: openDownload, label: t('nav.plugin'), icon: IconDownload },
  ];

  const [active, setActive] = useState(
    () => tabs.find((item) => item.link === pathname)?.link ?? RoutePath.HOME
  );

  const onClick = (link: RoutePath) => {
    setActive(link);
    onNavigate?.();
  };

  const links = tabs.map((item) =>
    item.link ? (
      <NavLink
        className={style.Link}
        data-active={item.link === active || undefined}
        to={item.link}
        key={item.label}
        onClick={() => onClick(item.link)}
      >
        <item.icon className={style.LinkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </NavLink>
    ) : (
      <a className={style.Link} key={item.label} onClick={() => item.onClick()}>
        <item.icon className={style.LinkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
    )
  );

  return (
    <Box className={style.Navbar} component="nav">
      <Logo
        onClick={() => {
          setActive(RoutePath.HOME);
          onNavigate?.();
        }}
        className={style.Logo}
      />
      <div>{links}</div>
      <div className={style.Footer}>
        <Flex gap="xs">
          <UploadForm />
          <Menu position="top-end" withArrow>
            <Menu.Target>
              <ActionIcon
                variant="default"
                size="lg"
                aria-label={t('nav.language')}
              >
                <IconLanguage stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => i18n.changeLanguage('en')}
                fw={i18n.language === 'en' ? 700 : 400}
              >
                🇬🇧 English
              </Menu.Item>
              <Menu.Item
                onClick={() => i18n.changeLanguage('vi')}
                fw={i18n.language === 'vi' ? 700 : 400}
              >
                🇻🇳 Tiếng Việt
              </Menu.Item>
              <Menu.Item
                onClick={() => i18n.changeLanguage('ja')}
                fw={i18n.language === 'ja' ? 700 : 400}
              >
                🇯🇵 日本語
              </Menu.Item>
            </Menu.Dropdown>          </Menu>
          <ActionIcon
            onClick={toggleColorScheme}
            variant="default"
            size="lg"
            aria-label={t('nav.toggleColorScheme')}
          >
            {computedColorScheme === 'dark' ? (
              <IconSun stroke={1.5} color="yellow" />
            ) : (
              <IconMoon stroke={1.5} color="violet" />
            )}
          </ActionIcon>
        </Flex>
      </div>
      <DownloadPluginModal opened={downloadOpened} onClose={closeDownload} />
    </Box>
  );
}
