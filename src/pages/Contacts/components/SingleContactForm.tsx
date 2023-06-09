import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from 'components/elements';
import { InputField } from 'components/forms';
import { IModalProps, Modal } from 'components/layout';
import { H1 } from 'components/typography';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IContactPayload } from 'services/resources';
import * as Yup from 'yup';

const DEFAULT_VALUES = { email: '', last_name: '', name: '' };

const VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string().email('form.email').required('form.required'),

  last_name: Yup.string().required('form.required'),

  name: Yup.string().required('form.required'),
});

export interface ISingleContactFormProps extends IModalProps {
  /**
   * If `true`, it means that the user has submit the form data.
   */
  isLoading?: boolean;
  /**
   * Action handler triggered on submit actions.
   */
  onSubmit: (v: IContactPayload) => Promise<void>;
}

export const SingleContactForm: React.FC<ISingleContactFormProps> = ({
  isLoading = false,
  onClose,
  onSubmit,
  ...rest
}): JSX.Element => {
  const methods = useForm<IContactPayload>({
    defaultValues: DEFAULT_VALUES,
    mode: 'all',
    resolver: yupResolver(VALIDATION_SCHEMA),
  });

  const { t } = useTranslation('page:contacts');

  return (
    <Modal onClose={onClose} {...rest}>
      <div className="px-6 py-4">
        <H1 className="!text-2xl">{t('actions.add-one')}</H1>
      </div>

      <div className="border-y-2 border-gray-200 bg-[#F6F8FB] p-6">
        <FormProvider {...methods}>
          <form
            className="flex flex-col gap-4 "
            id="single-contact-form"
            onSubmit={methods.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2 md:flex-row">
              <InputField
                className="w-full"
                isRequired
                label={t('name')}
                name="name"
              />

              <InputField
                className="w-full"
                label={t('last-name')}
                name="last_name"
              />
            </div>

            <InputField
              className="w-full md:w-2/3"
              isRequired
              label={t('email')}
              name="email"
              type="email"
            />
          </form>
        </FormProvider>
      </div>

      <div className="flex items-center justify-between px-6 py-4">
        <Button
          className="px-6 py-2 text-sm"
          colorScheme="gray"
          onClick={() => onClose()}
        >
          {t('button.cancel', { ns: 'common' })}
        </Button>

        <Button
          className="px-6 py-2 text-sm"
          colorScheme="tertiary"
          disabled={isLoading || !methods?.formState?.isValid}
          form="single-contact-form"
          type="submit"
        >
          {t('button.save', { ns: 'common' })}
        </Button>
      </div>
    </Modal>
  );
};
