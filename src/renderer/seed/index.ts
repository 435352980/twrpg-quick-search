import cnData from './cn.data';
import enData from './en.data';
import koData from './ko.data';
import imagesData from './images.data';

const fetchData = (url: string) => fetch(url).then(data => data.arrayBuffer());

export default Promise.all([
  fetchData(cnData),
  fetchData(enData),
  fetchData(koData),
  fetchData(imagesData),
]).then(arr => {
  const [cnBuffer, enBuffer, koBuff, imagesBuff] = arr;
  return import('wasm-flate').then(module => {
    const cn = JSON.parse(Buffer.from(module.deflate_decode_raw(Buffer.from(cnBuffer))).toString());
    const en = JSON.parse(Buffer.from(module.deflate_decode_raw(Buffer.from(enBuffer))).toString());
    const ko = JSON.parse(Buffer.from(module.deflate_decode_raw(Buffer.from(koBuff))).toString());

    const images = JSON.parse(
      Buffer.from(module.deflate_decode_raw(Buffer.from(imagesBuff))).toString(),
    );
    return { cn, en, ko, images };
  });
});

// export default import('wasm-flate').then(module => {
//   const cn = JSON.parse(Buffer.from(module.deflate_decode_raw(cnData)).toString());
//   const en = JSON.parse(Buffer.from(module.deflate_decode_raw(enData)).toString());
//   const ko = JSON.parse(Buffer.from(module.deflate_decode_raw(koData)).toString());
//   return { cn, en, ko };
// });
