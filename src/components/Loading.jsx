import { Loading } from 'notiflix/build/notiflix-loading-aio';

export const LoadStart = () => {Loading.pulse('Loading...');}
export const LoadRemove = () => {Loading.remove()};