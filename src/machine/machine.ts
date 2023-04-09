/* eslint-disable @typescript-eslint/no-explicit-any */
import { i18n } from 'locales';
import fp from 'lodash/fp';
import { toast } from 'react-toastify';
import {
  INewsletterPayload,
  NewsletterResources,
} from 'services/resources/newsletter';
import { assign, createMachine } from 'xstate';

import { IMachineContext, INITIAL_CONTEXT } from './machine.context';
import { IMachineEvents } from './machine.events';
import {
  MachineActions,
  MachineNodes,
  MachineServices,
} from './machine.helpers';

export const Machine = createMachine<IMachineContext, IMachineEvents>(
  {
    context: INITIAL_CONTEXT,
    id: 'MACHINE',
    initial: MachineNodes.IDLE,
    states: {
      [MachineNodes.IDLE]: {
        on: {
          MANUAL_SETUP: {
            target: MachineNodes.TEMPLATE,
          },
          QUICK_START: {
            target: MachineNodes.BUILDER,
          },
        },
      },
      [MachineNodes.BUILDER]: {
        on: {
          BACK: {
            target: MachineNodes.IDLE,
          },
          NEXT: {
            target: MachineNodes.CREATE_NEWSLETTER,
          },
        },
      },
      [MachineNodes.TEMPLATE]: {
        on: {
          BACK: {
            target: MachineNodes.IDLE,
          },
          NEXT: {
            target: MachineNodes.RECIPIENTS,
          },
        },
      },
      [MachineNodes.RECIPIENTS]: {
        on: {
          BACK: {
            target: MachineNodes.TEMPLATE,
          },
          NEXT: {
            target: MachineNodes.NEWSLETTER,
          },
        },
      },
      [MachineNodes.NEWSLETTER]: {
        on: {
          BACK: {
            target: MachineNodes.RECIPIENTS,
          },
          NEXT: {
            target: MachineNodes.REVIEW,
          },
        },
      },
      [MachineNodes.CREATE_NEWSLETTER]: {
        invoke: {
          id: MachineServices.CREATE_NEWSLETTER,
          onDone: {
            actions: [MachineActions.UPDATE_CONTEXT, MachineActions.SUCCESS],
            target: MachineNodes.REVIEW,
          },
          onError: {
            actions: MachineActions.FAILURE,
            target: MachineNodes.BUILDER,
          },
          src: MachineServices.CREATE_NEWSLETTER,
        },
      },
      [MachineNodes.REVIEW]: {
        on: {
          NEXT: {
            target: MachineNodes.SUBMIT_NEWSLETTER,
          },
        },
      },
      [MachineNodes.SUBMIT_NEWSLETTER]: {
        invoke: {
          id: MachineServices.SUBMIT_NEWSLETTER,
          onDone: {
            actions: MachineActions.SUCCESS,
            target: MachineNodes.RESULT,
          },
          onError: {
            actions: MachineActions.FAILURE,
            target: MachineNodes.REVIEW,
          },
          src: MachineServices.SUBMIT_NEWSLETTER,
        },
      },
      [MachineNodes.RESULT]: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      [MachineActions.SUCCESS]: assign((ctx) => ({ ...ctx, error: false })),
      [MachineActions.FAILURE]: assign((ctx, evt) => {
        const STATUS = (evt as any)?.data?.response?.status;
        toast.error(
          i18n.t(`api.default.status-code.${STATUS}`, { ns: 'errors' }),
        );
        return { ...ctx, error: true };
      }),
      [MachineActions.UPDATE_CONTEXT]: assign((ctx, evt) => ({
        ...ctx,
        ...fp.compose(fp.get('data'), fp.omit('type'))(evt),
      })),
    },
    services: {
      [MachineServices.CREATE_NEWSLETTER]: async (ctx, evt) => {
        const p = new FormData();

        p.append('subject', evt?.subject);

        if (ctx?.template_id) {
          p.append('template_id', ctx.template_id);
        }

        if (evt?.template_id) {
          p.append('template_id', evt.template_id);
        }

        if (evt?.attachment) {
          p.append('attachment', evt.attachment, evt.attachment?.name);
        }

        const { data } = await NewsletterResources.post(
          p as INewsletterPayload,
        );

        return {
          newsletter_id: data?.id,
          ...fp.pick(['bulk_id', 'template_id'])(evt),
        };
      },
      [MachineServices.SUBMIT_NEWSLETTER]: async (ctx) => {
        const { newsletter_id: newsletter, bulk_id } = ctx;

        await NewsletterResources.submission(newsletter as string, { bulk_id });
      },
    },
  },
);
