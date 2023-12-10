import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es';

export const formatFecha = (fecha) => {
  return format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: esLocale });
};
