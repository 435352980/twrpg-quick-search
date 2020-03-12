import enLocal from './en';
import cnLocal from './cn';

const getLocal = (lang: 'cn' | 'en' | 'ko') => ({ cn: cnLocal, en: enLocal, ko: enLocal }[lang]);

export default getLocal;
