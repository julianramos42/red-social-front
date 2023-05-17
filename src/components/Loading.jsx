import { Loading } from 'notiflix/build/notiflix-loading-aio';

export const LoadStart = () => {Loading.pulse('Cargando...');}
export const LoadRemove = () => {Loading.remove()};