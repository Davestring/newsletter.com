import { EmptySearch } from 'components/elements';
import { H1, H2 } from 'components/typography';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export const Contacts = (): JSX.Element => {
  const { t } = useTranslation('page:contacts');

  return (
    <>
      <Helmet>
        <title>{t('helmet')}</title>
      </Helmet>

      <H1 className="mb-2">{t('heading')}</H1>
      <H2 className="mb-12">{t('subheading')}</H2>

      <EmptySearch color="#384967" height={200} width={268} />
    </>
  );
};
