import { Ng2IzitoastService } from 'ng2-izitoast';
import { ClrDatagridStateInterface } from '@clr/angular';

export class Utilities {
  constructor() {}

  static displayToast(type: string, message?: string) {
    const iziToast = new Ng2IzitoastService();

    switch (type) {
      case 'success':
        iziToast.success({
          title: 'Success',
          message:
            message === undefined
              ? 'Operation completed successfully'
              : message,
          position: 'center',
          zindex: '99999',
        });
        break;

      case 'error':
        iziToast.error({
          title: 'Error',
          message:
            message === undefined
              ? 'Something went wrong. Please try again'
              : message,
          position: 'center',
          zindex: '99999',
        });
        break;

      case 'warning':
        iziToast.warning({
          title: 'Caution',
          message:
            message === undefined ? 'You forgot important data' : message,
          position: 'center',
          zindex: '99999',
        });
        break;

      case 'info':
        iziToast.info({
          title: 'Info',
          message: message === undefined ? '' : message,
          position: 'center',
          zindex: '99999',
        });
        break;
    }
  }

  static formatDatagridState(state: ClrDatagridStateInterface, page: number) {
    const filters: { [prop: string]: any } = {};

    if (state.filters) {
      const searchQueries = Object.values(state.filters)
        .map((val) => {
          return val['property'] + ':' + val['value'];
        })
        .join(',');
      filters['search'] = searchQueries;
    }

    if (state.sort) {
      filters['sort'] = state.sort.by;
      filters['order'] = state.sort.reverse ? 'DESC' : 'ASC';
    }

    filters['page'] = page;
    filters['size'] = 10;

    return filters;
  }

  static decamelize(str: string) {
    return str
      ? str
          .replace(/([a-z\d])([A-Z])/g, '$1 ' + '$2')
          .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1 ' + '$2')
          .replace(/(_)/g, ' ')
          .toLowerCase()
      : null;
  }
}
