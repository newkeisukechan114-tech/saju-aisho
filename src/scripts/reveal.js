// スクロールに合わせて .reveal の要素をフェードインさせる
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.remove('is-hidden'); io.unobserve(en.target); }
    }),
    { rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add('is-hidden'); io.observe(el); }
  });
}
