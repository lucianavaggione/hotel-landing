
export const qs = (s, el=document) => el.querySelector(s);
export const qsa = (s, el=document) => Array.from(el.querySelectorAll(s));
export const on = (el, ev, fn, opts) => el.addEventListener(ev, fn, opts);
export const off = (el, ev, fn) => el.removeEventListener(ev, fn);

export function lockScroll(lock=true){
  if(lock) document.documentElement.style.overflow='hidden';
  else document.documentElement.style.overflow='';
}

export function trapFocus(container){
  const FOCUSABLE = 'a[href],area[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const nodes = () => Array.from(container.querySelectorAll(FOCUSABLE)).filter(n=>n.offsetParent!==null);
  let handler = (e) => {
    if(e.key !== 'Tab') return;
    const cur = document.activeElement;
    const list = nodes();
    if(list.length===0) return;
    const first = list[0], last = list[list.length-1];
    if(e.shiftKey && cur===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && cur===last){ e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  return () => container.removeEventListener('keydown', handler);
}
