import iziToast from 'izitoast';
import { ClrDatagridStateInterface } from '@clr/angular';

export class Utilities {
  constructor() {}

  static displayToast(type: string, message?: string) {
    switch (type) {
      case 'success':
        iziToast.success({
          title: 'Success',
          message:
            message === undefined
              ? 'Operation completed successfully'
              : message,
          position: 'center',
          zindex: 99999,
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
          zindex: 99999,
        });
        break;

      case 'warning':
        iziToast.warning({
          title: 'Caution',
          message:
            message === undefined ? 'You forgot important data' : message,
          position: 'center',
          zindex: 99999,
        });
        break;

      case 'info':
        iziToast.info({
          title: 'Info',
          message: message === undefined ? '' : message,
          position: 'center',
          zindex: 99999,
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

  /**
   * Turns a Firestore error into something an admin can act on. A rules
   * rejection otherwise surfaces as a bare "Missing or insufficient
   * permissions", which says nothing about what needs to change.
   */
  static firestoreErrorMessage(error: any, fallback: string): string {
    if (error?.code === 'permission-denied') {
      return (
        'Firestore security rules rejected this. Your account needs a staff ' +
        "role: check that users/{your uid}.role is the string 'Administrator' " +
        "or 'Counsellor' in the Firebase console."
      );
    }
    if (error?.code === 'unavailable') {
      return 'Could not reach Firestore. Check your connection and try again.';
    }
    return error?.message || fallback;
  }

  /**
   * The document's `order` as a number, or null when it is absent, blank or
   * not numeric. Firestore documents in this project have historically been
   * written with `order` missing entirely, as a number, or as a numeric
   * string, so every consumer has to normalise before sorting.
   */
  static orderValue(item: any): number | null {
    const raw = item?.order;
    if (raw === null || raw === undefined || raw === '') {
      return null;
    }
    const value = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(value) ? value : null;
  }

  /**
   * Sort comparator replacing Firestore's `orderBy('order')`, which silently
   * omits every document that has no `order` field. Ordered items come first
   * ascending; the rest fall to the end sorted by name, so nothing is ever
   * hidden just because it is missing a field.
   */
  static byOrder(a: any, b: any): number {
    const aOrder = Utilities.orderValue(a);
    const bOrder = Utilities.orderValue(b);

    if (aOrder !== null && bOrder !== null && aOrder !== bOrder) {
      return aOrder - bOrder;
    }
    if (aOrder !== null && bOrder === null) {
      return -1;
    }
    if (aOrder === null && bOrder !== null) {
      return 1;
    }
    return (a?.name || '').localeCompare(b?.name || '');
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
