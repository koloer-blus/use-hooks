import useElementInView from './useElementInView';

const lazyLoadImg = (el: any) => {
  const { target } = el;
  target.src = target.dataset.src;
}

const useLazyLoadImg = (imgElList: HTMLImageElement[]) => {
  useElementInView(imgElList, lazyLoadImg, {
    threshold: [1]
  })
};

export default useLazyLoadImg;