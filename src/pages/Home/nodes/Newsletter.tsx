import { FileField, InputField } from 'components/forms';
import { H1, H2 } from 'components/typography';
import { NewsletterContext } from 'contexts';
import { useCallback, useContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const DEFAULT_VALUES = { attachment: undefined, name: '', template_id: '' };

type INewsletterPayload = {
  subject: string;
  template_id?: string;
  attachment?: File;
};

export const NewsletterNode = (): JSX.Element => {
  const context = useContext(NewsletterContext);

  const methods = useForm<INewsletterPayload>({
    defaultValues: DEFAULT_VALUES,
    mode: 'all',
  });

  const { t } = useTranslation('page:home');

  const handleOnSubmit = useCallback((v: INewsletterPayload) => {
    context?.send('NEXT', v);
  }, []);

  return (
    <>
      <H1 className="mb-2 text-center uppercase">
        {t('node.newsletter.title')}
      </H1>

      <H2 className="mb-8 text-center">{t('node.newsletter.subtitle')}</H2>

      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4"
          id="newsletter-forms"
          onSubmit={methods.handleSubmit(handleOnSubmit)}
        >
          <InputField
            label={t('form.newsletter.subject.label', { ns: 'common' })}
            name="subject"
            size="md"
          />

          <FileField
            accept=".png,.pdf"
            helper={t('form.newsletter.attachment.helper', { ns: 'common' })}
            icon="img"
            label={t('form.newsletter.attachment.label', { ns: 'common' })}
            name="attachment"
          />
        </form>
      </FormProvider>
    </>
  );
};