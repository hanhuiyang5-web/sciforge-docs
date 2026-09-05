import React, {useCallback, useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';

type Preview = {src: string; alt: string; caption: string};
const imageSelector = '.theme-doc-markdown img';
const dialogId = 'sf-image-preview';

/** Enhance rendered guides without changing MDX content or linked images. */
function ImagePreview(): ReactNode {
  const [preview, setPreview] = useState<Preview | null>(null);
  const [originalSize, setOriginalSize] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    dialogRef.current?.close();
    setPreview(null);
    setOriginalSize(false);
    if (triggerRef.current?.isConnected) triggerRef.current.focus({preventScroll: true});
  }, []);

  useEffect(() => {
    const enhance = () => {
      if (dialogRef.current?.open && !triggerRef.current?.isConnected) close();
      document.querySelectorAll<HTMLImageElement>(imageSelector).forEach((img) => {
        if (img.closest('a, button') || img.classList.contains('sf-zoomable-image')) return;
        img.classList.add('sf-zoomable-image');
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.setAttribute('aria-haspopup', 'dialog');
        img.setAttribute('aria-controls', dialogId);
        img.setAttribute('aria-label', `${img.alt || '文档图片'}，放大查看`);
      });
    };
    const open = (target: EventTarget | null) => {
      if (!(target instanceof HTMLImageElement) || !target.matches(`${imageSelector}.sf-zoomable-image`)) return false;
      triggerRef.current = target;
      const sibling = target.nextElementSibling;
      const caption = sibling?.tagName === 'EM'
        ? sibling.textContent || ''
        : target.closest('figure')?.querySelector('figcaption')?.textContent || '';
      setOriginalSize(false);
      setPreview({src: target.currentSrc || target.src, alt: target.alt, caption});
      return true;
    };
    const handleClick = (event: MouseEvent) => {
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) open(event.target);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.repeat && open(event.target)) event.preventDefault();
    };
    enhance();
    const observer = new MutationObserver(enhance);
    observer.observe(document.body, {childList: true, subtree: true});
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  useEffect(() => {
    if (!preview) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [preview]);

  return (
    <dialog ref={dialogRef} id={dialogId} className="sf-image-dialog"
      aria-labelledby="sf-image-preview-title" aria-describedby="sf-image-preview-caption"
      onCancel={(event) => {event.preventDefault(); close();}}
      onClick={(event) => {if (event.target === event.currentTarget) close();}}>
      {preview && <>
        <div className="sf-image-dialog__toolbar">
          <div className="sf-image-dialog__heading">
            <span className="sf-image-dialog__eyebrow">SciForge / 界面预览</span>
            <span id="sf-image-preview-title" className="sf-image-dialog__title">{preview.alt || '文档图片'}</span>
          </div>
          <div className="sf-image-dialog__actions">
            <button type="button" aria-pressed={originalSize} onClick={() => setOriginalSize((value) => !value)}>{originalSize ? '适应窗口' : '原始尺寸'}</button>
            <button type="button" className="sf-image-dialog__close" aria-label="关闭图片预览" onClick={close} autoFocus>×</button>
          </div>
        </div>
        <div className={`sf-image-dialog__canvas${originalSize ? ' sf-image-dialog__canvas--original' : ''}`} tabIndex={originalSize ? 0 : undefined} aria-label={originalSize ? '原始尺寸图片，可滚动查看' : undefined}>
          <img src={preview.src} alt={preview.alt} />
        </div>
        <p id="sf-image-preview-caption" className="sf-image-dialog__caption">
          <span>{preview.caption || preview.alt || 'SciForge 文档配图'}</span><span>按 Esc 关闭</span>
        </p>
      </>}
    </dialog>
  );
}

export default function Root({children}: {children: ReactNode}): ReactNode {
  return <>{children}<ImagePreview /></>;
}
