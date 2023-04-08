import { FileField, InputField } from 'components/forms';
import { H1, H2 } from 'components/typography';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RiContactsBook2Line } from 'react-icons/ri';

const DEFAULT_VALUES = { csv: undefined, name: '' };

type IBulkPayload = { name: string; csv?: File };

export const RecipientsScreen = (): JSX.Element => {
  const methods = useForm<IBulkPayload>({
    defaultValues: DEFAULT_VALUES,
    mode: 'all',
  });

  const { t } = useTranslation('page:home');

  const handleOnSubmit = useCallback((v: IBulkPayload) => {
    // eslint-disable-next-line no-console
    console.log(v);
  }, []);

  return (
    <>
      <H1 className="mb-2 text-center uppercase">
        {t('screen.recipients.title')}
      </H1>

      <H2 className="mb-8 text-center">{t('screen.recipients.subtitle')}</H2>

      <div className="flex gap-8">
        <FormProvider {...methods}>
          <form
            className="flex flex-[2] flex-col gap-4"
            onSubmit={methods.handleSubmit(handleOnSubmit)}
          >
            <InputField
              label={t('form.bulk.name.label', { ns: 'common' })}
              name="name"
              size="md"
            />

            <FileField
              accept=".csv"
              helper={t('form.bulk.csv.helper', { ns: 'common' })}
              icon="csv"
              label={t('form.bulk.csv.label', { ns: 'common' })}
              name="csv"
            />
          </form>
        </FormProvider>

        <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:gap-4">
          <RiContactsBook2Line color="#00C7B1" size={180} />
          <p className="text-justify text-xs font-medium text-primary-500">
            {t('screen.recipients.terms')}
          </p>
        </div>
      </div>
    </>
  );
};
