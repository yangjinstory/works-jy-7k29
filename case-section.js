function caseDiagram(items) {
  return items ? `<ol class="strategy-flow">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>` : '';
}

function caseMedia(item) {
  return item ? `<figure class="case-figure${item.wide ? ' case-figure-wide' : ''}"><button type="button" class="material-button" data-case-image="${escapeHtml(item.src)}" data-caption="${escapeHtml(item.caption)}" aria-label="${escapeHtml(item.caption)} 확대"><img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.caption)}" loading="lazy"></button><figcaption>${escapeHtml(item.caption)}</figcaption></figure>` : '';
}

function caseMetrics(item) {
  const scale = Math.max(100, ...item.metrics.map(metric => metric.index ?? 0));
  return `<div class="case-metrics">${item.metrics.map(metric => `
    <div class="case-metric">
      <span>${escapeHtml(metric.label)}</span><strong>${escapeHtml(metric.value)}</strong>
      ${metric.index ? `<div class="index-bars" role="img" aria-label="기준 100, 비교 지수 ${metric.index}">
        <div><i style="width:${100 / scale * 100}%"></i><b>100</b></div>
        <div><i style="width:${metric.index / scale * 100}%"></i><b>${metric.index}</b></div>
      </div>` : ''}
    </div>`).join('')}</div>${item.chartNote ? `<p class="note">${escapeHtml(item.chartNote)}</p>` : ''}`;
}

function caseLink(item) {
  return item.related ? `<a class="case-video" href="${escapeHtml(item.related[1])}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.related[0])} ↗</a>` : '';
}

function caseNarrative(item) {
  return `<div class="case-narrative">
    <h3>배경 및 과제</h3><p>${escapeHtml(item.background)}</p>
    <h3>핵심 전략</h3><p>${escapeHtml(item.strategy)}</p>
    <h3>담당 역할</h3><p>${escapeHtml(item.role)}</p>
    <h3>주요 실행</h3><ul>${item.actions.map(action => `<li>${escapeHtml(action)}</li>`).join('')}</ul>
  </div>`;
}

if (document.getElementById('caseCards')) {
  document.getElementById('caseCards').innerHTML = CASES.map((item, index) => `
    <a class="card" href="#case-${index + 1}">
      <div class="num">사례 ${String(index + 1).padStart(2, '0')}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <strong>${escapeHtml(item.metrics[0].value)} ↘</strong>
    </a>`).join('');

  document.getElementById('caseArticles').innerHTML = CASES.map((item, index) => `
    <article class="case-study campaign" id="case-${index + 1}">
      <div class="eyebrow case-eyebrow">사례 ${String(index + 1).padStart(2, '0')}</div>
      <h2>${escapeHtml(item.title)}</h2>
      <div class="campaign-grid">
        ${caseNarrative(item)}
        <div class="case-evidence">
          <h3>${item.gallery || item.media || item.extra ? '참고 이미지' : '개편 구조'}</h3>${item.evidence ? `<p>${escapeHtml(item.evidence)}</p>` : ''}
          ${caseDiagram(item.diagram)}
          <div class="case-gallery">${(item.gallery ?? [item.media, item.extra].filter(Boolean)).map(caseMedia).join('')}</div>
          ${caseLink(item)}
        </div>
      </div>
      <div class="case-outcome"><h3>프로젝트 성과 및 인사이트</h3>${caseMetrics(item)}<p>${escapeHtml(item.insight)}</p></div>
      <a class="case-top" href="#cases">↑ 주요 성과 사례 목록으로</a>
    </article>`).join('');
}

let caseImageTrigger;
document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-case-image]');
  if (!trigger) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'case-image-dialog';
  dialog.setAttribute('aria-label', trigger.dataset.caption);
  const close = document.createElement('button');
  close.type = 'button';
  close.textContent = '닫기 ×';
  close.addEventListener('click', () => dialog.close());
  const img = new Image();
  img.src = trigger.dataset.caseImage;
  img.alt = trigger.dataset.caption;
  dialog.append(close, img);
  caseImageTrigger = trigger;
  dialog.addEventListener('close', () => {
    dialog.remove();
    caseImageTrigger?.focus();
  });
  document.body.append(dialog);
  dialog.showModal();
});
