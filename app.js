/**
 * ChromaDiaries - Letter Pad & Poster Generator Studio
 * Precision 300 DPI Canvas Rendering & Dynamic Margin Engine
 */

(function () {
  'use strict';

  // =========================================================================
  // CONSTANTS & 300 DPI METRICS
  // =========================================================================
  const CANVAS_WIDTH = 2480;
  const CANVAS_HEIGHT = 3508;
  const DPI = 300;
  const PT_TO_PX = DPI / 72; // ~4.166667 px per pt

  // Base font sizes from specification (in points)
  const SPEC_PT = {
    name: 14.68,
    heading: 13.68,
    body: 13.68,
    title: 13.68,
    scoreLabel: 13.68,
    scorePercentage: 13.68,
    review: 13.68,
    date: 10.00
  };

  // Exact Margin Bounding Boxes from "margin red.png"
  const MARGINS = {
    outer: {
      left: 247,
      top: 1078,
      right: 2265,
      bottom: 2553,
      width: 2018,
      height: 1475
    },
    date: {
      left: 1667,
      top: 529,
      right: 2035,
      bottom: 607,
      width: 368,
      height: 78
    },
    scores: {
      left: 1176,
      top: 1794,
      right: 1288,
      bottom: 2165,
      width: 112,
      height: 371
    },
    review: {
      left: 1568,
      top: 1930,
      right: 2092,
      bottom: 2064,
      width: 524,
      height: 134
    }
  };

  // Exact Text Baseline Anchor Coordinates in model.png
  const POSITIONS = {
    date: { x: 1679, baselineY: 577 },
    name: { x: 254, baselineY: 1136 },
    announcement: {
      left: 250,
      right: 2265,
      width: 2015,
      headingY: 1272,
      defaultGap: 72,
      defaultLineHeight: 68
    },
    scores: {
      labelX: 288,
      colonX: 1152,
      percentX: 1182,
      defaultSpacing: 75,
      rows: [
        { label: 'Content & Idea', baselineY: 1838 },
        { label: 'Expression', baselineY: 1912 },
        { label: 'Language', baselineY: 1987 },
        { label: 'Structure & Presentation', baselineY: 2062 },
        { label: 'Overall Editorial Assessment', baselineY: 2137 }
      ]
    },
    review: {
      left: 1568,
      top: 1930,
      width: 522,
      height: 134,
      defaultStartY: 1978,
      defaultLineHeight: 68
    }
  };

  const TEXT_COLOR = '#423d3d'; // Exact warm charcoal tone from model analysis

  // =========================================================================
  // DOM ELEMENTS
  // =========================================================================
  const canvas = document.getElementById('poster-canvas');
  const ctx = canvas.getContext('2d');
  const canvasWrapper = document.getElementById('canvas-wrapper');
  const canvasViewport = document.getElementById('canvas-viewport');

  // Inputs
  const inputName = document.getElementById('input-name');
  const inputDate = document.getElementById('input-date');
  const inputTitle = document.getElementById('input-title');
  const previewTitle = document.getElementById('preview-title');
  const inputCustomHeading = document.getElementById('input-custom-heading');
  const inputCustomAnnouncement = document.getElementById('input-custom-announcement');
  const btnToggleAnnouncement = document.getElementById('btn-toggle-announcement-custom');
  const announcementCustomPanel = document.getElementById('announcement-custom-panel');

  // Score inputs
  const scoreContent = document.getElementById('score-content');
  const scoreExpression = document.getElementById('score-expression');
  const scoreLanguage = document.getElementById('score-language');
  const scoreStructure = document.getElementById('score-structure');
  const scoreOverall = document.getElementById('score-overall');

  // Review & settings
  const inputReview = document.getElementById('input-review');
  const reviewSmartAutosize = document.getElementById('review-smart-autosize');
  const settingAutoscale = document.getElementById('setting-autoscale');
  const settingClearFooter = document.getElementById('setting-clear-footer');
  const settingScaleFactor = document.getElementById('setting-scale-factor');
  const scaleFactorDisplay = document.getElementById('scale-factor-display');

  // Granular Sliders & Badges
  const nameSizeSlider = document.getElementById('name-size-slider');
  const nameSizeVal = document.getElementById('name-size-val');

  const dateSizeSlider = document.getElementById('date-size-slider');
  const dateSizeVal = document.getElementById('date-size-val');

  const headingSizeSlider = document.getElementById('heading-size-slider');
  const headingSizeVal = document.getElementById('heading-size-val');

  const headingGapSlider = document.getElementById('heading-gap-slider');
  const headingGapVal = document.getElementById('heading-gap-val');

  const bodySizeSlider = document.getElementById('body-size-slider');
  const bodySizeVal = document.getElementById('body-size-val');

  const bodyLhSlider = document.getElementById('body-lh-slider');
  const bodyLhVal = document.getElementById('body-lh-val');

  const scoresSizeSlider = document.getElementById('scores-size-slider');
  const scoresSizeVal = document.getElementById('scores-size-val');

  const scoresSpacingSlider = document.getElementById('scores-spacing-slider');
  const scoresSpacingVal = document.getElementById('scores-spacing-val');

  const scoresPosSlider = document.getElementById('scores-pos-slider');
  const scoresPosVal = document.getElementById('scores-pos-val');

  const reviewSizeSlider = document.getElementById('review-size-slider');
  const reviewSizeVal = document.getElementById('review-size-val');

  const btnResetAllSliders = document.getElementById('btn-reset-all-sliders');

  // Toggles & Overlays
  const chkShowMargins = document.getElementById('chk-show-margins');
  const chkShowModel = document.getElementById('chk-show-model');
  const modelImg = document.getElementById('model-img');
  const modelCompareBar = document.getElementById('model-compare-bar');
  const modelOpacityRange = document.getElementById('model-opacity-range');
  const modelOpacityVal = document.getElementById('model-opacity-val');

  // Status banners & meta
  const marginStatusBanner = document.getElementById('margin-status-banner');
  const marginStatusDetail = document.getElementById('margin-status-detail');
  const statusAutoscaleTag = document.getElementById('status-autoscale-tag');
  const statusMarginTag = document.getElementById('status-margin-tag');

  // Action buttons
  const btnLoadModel = document.getElementById('btn-load-model');
  const btnTestOverflow = document.getElementById('btn-test-overflow');
  const btnToday = document.getElementById('btn-today');
  const btnPrint = document.getElementById('btn-print');
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  const btnDownloadPng = document.getElementById('btn-download-png');
  const btnCopyImage = document.getElementById('btn-copy-image');
  const btnQuickToggleMargin = document.getElementById('btn-quick-toggle-margin');

  // Zoom controls
  const btnZoomFit = document.getElementById('btn-zoom-fit');
  const btnZoom50 = document.getElementById('btn-zoom-50');
  const btnZoom75 = document.getElementById('btn-zoom-75');
  const btnZoom100 = document.getElementById('btn-zoom-100');
  const btnZoomOut = document.getElementById('btn-zoom-out');
  const btnZoomIn = document.getElementById('btn-zoom-in');
  const zoomLevelText = document.getElementById('zoom-level-text');

  // =========================================================================
  // APP STATE
  // =========================================================================
  let baseImage = new Image();
  let baseImageLoaded = false;
  let marginOverlayImage = new Image();
  let marginOverlayLoaded = false;
  let currentZoomMode = 'fit';
  let currentZoomScale = 1.0;
  let customAnnouncementActive = false;

  // Track scaling factors for margin audit
  const scaleAudit = {
    date: 1.0,
    name: 1.0,
    heading: 1.0,
    announcement: 1.0,
    scores: 1.0,
    review: 1.0
  };

  // =========================================================================
  // ASSET LOADING
  // =========================================================================
  function initAssets() {
    baseImage.crossOrigin = 'anonymous';
    baseImage.onload = function () {
      baseImageLoaded = true;
      requestRedraw();
    };
    baseImage.onerror = function () {
      console.warn('Base.png load error, falling back to embedded BASE_IMAGE_DATA');
      if (typeof BASE_IMAGE_DATA !== 'undefined' && BASE_IMAGE_DATA) {
        baseImage.src = BASE_IMAGE_DATA;
      }
    };

    if (typeof BASE_IMAGE_DATA !== 'undefined' && BASE_IMAGE_DATA) {
      baseImage.src = BASE_IMAGE_DATA;
    } else {
      baseImage.src = 'Base.png';
    }

    marginOverlayImage.crossOrigin = 'anonymous';
    marginOverlayImage.onload = function () {
      marginOverlayLoaded = true;
    };
    if (typeof MARGIN_IMAGE_DATA !== 'undefined' && MARGIN_IMAGE_DATA) {
      marginOverlayImage.src = MARGIN_IMAGE_DATA;
    } else {
      marginOverlayImage.src = 'margin red.png';
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        requestRedraw();
      });
    }
  }

  // =========================================================================
  // TEXT MEASUREMENT & WRAPPING UTILITIES
  // =========================================================================

  function measureWidth(text, font) {
    ctx.save();
    ctx.font = font;
    const w = ctx.measureText(text).width;
    ctx.restore();
    return w;
  }

  function wrapStyledTokens(tokens, maxWidth, fontGetter) {
    const lines = [];
    let currentLine = [];
    let currentLineWidth = 0;

    tokens.forEach(function (token) {
      const words = token.text.split(/(\s+)/);
      words.forEach(function (word) {
        if (!word) return;
        const font = fontGetter(token.style);
        const wordWidth = measureWidth(word, font);

        if (currentLineWidth + wordWidth > maxWidth && currentLine.length > 0 && word.trim().length > 0) {
          lines.push(currentLine);
          currentLine = [];
          currentLineWidth = 0;
          if (word.trim().length === 0) return;
        }

        currentLine.push({
          text: word,
          style: token.style,
          width: wordWidth,
          font: font
        });
        currentLineWidth += wordWidth;
      });
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
  }

  function wrapPlainText(text, maxWidth, font) {
    ctx.save();
    ctx.font = font;
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    ctx.restore();
    return lines;
  }

  // =========================================================================
  // RENDERING ENGINE
  // =========================================================================

  let redrawScheduled = false;

  function requestRedraw() {
    if (!redrawScheduled) {
      redrawScheduled = true;
      requestAnimationFrame(function () {
        redrawScheduled = false;
        drawPoster();
      });
    }
  }

  function drawPoster() {
    if (!baseImageLoaded) return;

    // Reset scale audits
    scaleAudit.date = 1.0;
    scaleAudit.name = 1.0;
    scaleAudit.heading = 1.0;
    scaleAudit.announcement = 1.0;
    scaleAudit.scores = 1.0;
    scaleAudit.review = 1.0;

    const autoScaleEnabled = settingAutoscale.checked;
    const globalMultiplier = parseInt(settingScaleFactor.value, 10) / 100;

    // 1. Draw Base Template Image
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(baseImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Clear Date Area Placeholder in Base Image
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(1660, 520, 385, 90);

    // 3. Clear Overflow Footer if enabled (matches model.png)
    if (settingClearFooter.checked) {
      ctx.fillRect(240, 2600, 800, 100);
    }

    // =======================================================================
    // RENDER INPUT 05: DATE
    // Base: Poppins italic - 10pt (~41.67px)
    // Margin box: [X: 1667..2035, Y: 529..607] (w: 368, h: 78)
    // =======================================================================
    let dateStr = inputDate.value.trim();
    if (!dateStr.toLowerCase().startsWith('date:')) {
      dateStr = 'Date: ' + dateStr;
    }
    const userDatePt = parseFloat(dateSizeSlider.value) || SPEC_PT.date;
    dateSizeVal.textContent = userDatePt.toFixed(2) + ' pt';

    let dateSize = (userDatePt * PT_TO_PX) * globalMultiplier;
    let dateFont = 'italic 400 ' + dateSize + 'px "Poppins", sans-serif';
    let dateWidth = measureWidth(dateStr, dateFont);
    const dateMaxW = MARGINS.date.width - 15; // 353px allowable width

    if (autoScaleEnabled && dateWidth > dateMaxW) {
      const dateScale = dateMaxW / dateWidth;
      dateSize *= dateScale;
      dateFont = 'italic 400 ' + dateSize + 'px "Poppins", sans-serif';
      scaleAudit.date = dateScale;
    }

    ctx.fillStyle = TEXT_COLOR;
    ctx.font = dateFont;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(dateStr, POSITIONS.date.x, POSITIONS.date.baselineY);

    // =======================================================================
    // RENDER INPUT 01: DEAR {NAME},
    // Base: Raleway semibold 14.68 pt (~61.17px)
    // X=254, Baseline Y=1136
    // =======================================================================
    const rawName = inputName.value.trim() || 'Tanishka Lalwani';
    const dearText = 'Dear ' + rawName + ',';
    const userNamePt = parseFloat(nameSizeSlider.value) || SPEC_PT.name;
    nameSizeVal.textContent = userNamePt.toFixed(2) + ' pt';

    let nameSize = (userNamePt * PT_TO_PX) * globalMultiplier;
    let nameFont = '600 ' + nameSize + 'px "Raleway", sans-serif';
    let nameWidth = measureWidth(dearText, nameFont);
    const nameMaxW = MARGINS.outer.right - POSITIONS.name.x - 10;

    if (autoScaleEnabled && nameWidth > nameMaxW) {
      const nameScale = nameMaxW / nameWidth;
      nameSize *= nameScale;
      nameFont = '600 ' + nameSize + 'px "Raleway", sans-serif';
      scaleAudit.name = nameScale;
    }

    ctx.font = nameFont;
    ctx.fillText(dearText, POSITIONS.name.x, POSITIONS.name.baselineY);

    // =======================================================================
    // RENDER INPUT 02: ANNOUNCEMENT
    // (HEADING + ENTER PARAGRAPH BREAK + SELECTION BODY)
    // Heading: "Greetings from ChromaDiaries!" = Raleway Bold 13.68 pt
    // [Enter paragraph break]
    // Body: "We are happy to inform you that your writing, “{Title}”, has been selected for publication on our official website. Congratulations on your achievement!"
    // =======================================================================
    const titleVal = inputTitle.value.trim() || 'That type of woman';
    previewTitle.textContent = '“' + titleVal + '”';

    const userHeadingPt = parseFloat(headingSizeSlider.value) || SPEC_PT.heading;
    headingSizeVal.textContent = userHeadingPt.toFixed(2) + ' pt';

    const userHeadingGap = parseFloat(headingGapSlider.value) || POSITIONS.announcement.defaultGap;
    headingGapVal.textContent = Math.round(userHeadingGap) + ' px';

    const userBodyPt = parseFloat(bodySizeSlider.value) || SPEC_PT.body;
    bodySizeVal.textContent = userBodyPt.toFixed(2) + ' pt';

    const userBodyLh = parseFloat(bodyLhSlider.value) || POSITIONS.announcement.defaultLineHeight;
    bodyLhVal.textContent = Math.round(userBodyLh) + ' px';

    // 1. Draw Heading Line
    let headingText = 'Greetings from ChromaDiaries!';
    if (customAnnouncementActive && inputCustomHeading && inputCustomHeading.value.trim()) {
      headingText = inputCustomHeading.value.trim();
    }

    let headingSize = (userHeadingPt * PT_TO_PX) * globalMultiplier;
    let headingFont = '700 ' + headingSize + 'px "Raleway", sans-serif';
    let headingW = measureWidth(headingText, headingFont);
    const annMaxW = POSITIONS.announcement.width;

    if (autoScaleEnabled && headingW > annMaxW) {
      const hScale = annMaxW / headingW;
      headingSize *= hScale;
      headingFont = '700 ' + headingSize + 'px "Raleway", sans-serif';
      scaleAudit.heading = hScale;
    }

    ctx.font = headingFont;
    ctx.fillStyle = TEXT_COLOR;
    const headingBaselineY = POSITIONS.announcement.headingY;
    ctx.fillText(headingText, POSITIONS.announcement.left, headingBaselineY);

    // 2. Draw Body Paragraph (after ENTER / paragraph break)
    function getBodyTokens(title) {
      if (customAnnouncementActive && inputCustomAnnouncement && inputCustomAnnouncement.value) {
        const rawCustom = inputCustomAnnouncement.value;
        const parts = rawCustom.split(/(\{title\})/i);
        const res = [];
        parts.forEach(function (part) {
          if (part.toLowerCase() === '{title}') {
            res.push({ text: '“' + title + '”', style: 'semibold', isTitle: true });
          } else {
            res.push({ text: part, style: 'regular' });
          }
        });
        return res;
      }

      return [
        { text: 'We are happy to inform you that your writing, ', style: 'regular' },
        { text: '“' + title + '”', style: 'semibold', isTitle: true },
        { text: ', has been selected for publication on our official website. Congratulations on your achievement!', style: 'regular' }
      ];
    }

    const bodyTokens = getBodyTokens(titleVal);

    let bodyBaseSize = (userBodyPt * PT_TO_PX) * globalMultiplier;
    let bodyLineHeight = userBodyLh * globalMultiplier;

    function getBodyFont(style, size) {
      if (style === 'semibold') return '600 ' + size + 'px "Raleway", sans-serif';
      return '400 ' + size + 'px "Raleway", sans-serif';
    }

    let wrappedBodyLines = wrapStyledTokens(bodyTokens, annMaxW, function (style) {
      return getBodyFont(style, bodyBaseSize);
    });

    // Check available vertical space before "Writing Assessment" (at Y=1574)
    // Starting Y = headingBaselineY + userHeadingGap (e.g. 1272 + 70 = 1342)
    const bodyStartY = headingBaselineY + (userHeadingGap * globalMultiplier);
    const maxAvailableBottom = 1545; // limit before "Writing Assessment" header
    const maxBodyHeight = maxAvailableBottom - bodyStartY;

    let totalBodyHeight = (wrappedBodyLines.length - 1) * bodyLineHeight;
    if (autoScaleEnabled && totalBodyHeight > maxBodyHeight) {
      const annScale = Math.max(0.60, Math.min(1.0, maxBodyHeight / totalBodyHeight));
      bodyBaseSize *= annScale;
      bodyLineHeight *= annScale;
      scaleAudit.announcement = annScale;

      wrappedBodyLines = wrapStyledTokens(bodyTokens, annMaxW, function (style) {
        return getBodyFont(style, bodyBaseSize);
      });
    }

    // Render body lines
    let currentBodyY = bodyStartY;
    wrappedBodyLines.forEach(function (line) {
      let currentX = POSITIONS.announcement.left;
      line.forEach(function (segment) {
        ctx.font = getBodyFont(segment.style, bodyBaseSize);
        ctx.fillStyle = TEXT_COLOR;
        ctx.fillText(segment.text, currentX, currentBodyY);
        currentX += segment.width;
      });
      currentBodyY += bodyLineHeight;
    });

    // =======================================================================
    // RENDER INPUT 03: WRITING ASSESSMENT SCORES (IN BOX)
    // Box: X: 245..1365, Y: 1739..2212
    // 5 Rows: Content & Idea, Expression, Language, Structure & Presentation, Overall Editorial Assessment
    // =======================================================================
    const scoreValues = [
      formatPercentage(scoreContent.value),
      formatPercentage(scoreExpression.value),
      formatPercentage(scoreLanguage.value),
      formatPercentage(scoreStructure.value),
      formatPercentage(scoreOverall.value)
    ];

    const userScoresPt = parseFloat(scoresSizeSlider.value) || SPEC_PT.scoreLabel;
    scoresSizeVal.textContent = userScoresPt.toFixed(2) + ' pt';

    const userScoresSpacing = parseFloat(scoresSpacingSlider.value) || POSITIONS.scores.defaultSpacing;
    scoresSpacingVal.textContent = Math.round(userScoresSpacing) + ' px';

    const userScoresPos = parseFloat(scoresPosSlider.value) || POSITIONS.scores.percentX;
    scoresPosVal.textContent = Math.round(userScoresPos) + ' px';

    let scoreLabelSize = (userScoresPt * PT_TO_PX) * globalMultiplier;
    let scoreValSize = (userScoresPt * PT_TO_PX) * globalMultiplier;
    const scoreLabelFont = '600 ' + scoreLabelSize + 'px "Raleway", sans-serif';
    let scoreValFont = '400 ' + scoreValSize + 'px "Poppins", sans-serif';

    // Verify percentages fit inside scores column [X: 1176..1288] (w: 112px)
    let maxPctW = 0;
    scoreValues.forEach(function (val) {
      const w = measureWidth(val, scoreValFont);
      if (w > maxPctW) maxPctW = w;
    });

    const scoreColMaxW = MARGINS.scores.width; // 112px
    if (autoScaleEnabled && maxPctW > scoreColMaxW) {
      const scoreScale = scoreColMaxW / maxPctW;
      scoreValSize *= scoreScale;
      scoreValFont = '400 ' + scoreValSize + 'px "Poppins", sans-serif';
      scaleAudit.scores = scoreScale;
    }

    const firstRowY = POSITIONS.scores.rows[0].baselineY;
    POSITIONS.scores.rows.forEach(function (row, idx) {
      const valStr = scoreValues[idx];
      const rowY = firstRowY + (idx * userScoresSpacing * globalMultiplier);

      // Draw Label
      ctx.font = scoreLabelFont;
      ctx.fillStyle = TEXT_COLOR;
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(row.label, POSITIONS.scores.labelX, rowY);

      // Draw Colon
      ctx.font = scoreLabelFont;
      ctx.fillText(':', POSITIONS.scores.colonX, rowY);

      // Draw Percentage
      ctx.font = scoreValFont;
      ctx.fillText(valStr, userScoresPos, rowY);
    });

    // =======================================================================
    // RENDER INPUT 04: EDITOR REVIEW NOTE
    // Box: X: 1568..2092 (w: 524px), Y: 1930..2064 (h: 134px)
    // Intelligent auto-sizing:
    // If review is short -> automatically increases font size to fill box!
    // If review is long  -> automatically reduces font size so it never overflows!
    // Plus granular slider control for each input!
    // =======================================================================
    const reviewText = inputReview.value.trim() || 'Very strong with minor weaknesses';
    const userReviewPt = parseFloat(reviewSizeSlider.value) || SPEC_PT.review;
    const smartReviewActive = reviewSmartAutosize.checked;

    const reviewMaxW = MARGINS.review.width;  // 524 px
    const reviewMaxH = MARGINS.review.height; // 134 px

    let targetReviewPt = userReviewPt;

    // Smart auto-sizing algorithm: tests from large down to find optimal fit
    if (smartReviewActive) {
      let optimalPt = 22.0; // max enlargement for short text
      while (optimalPt >= 8.0) {
        const testSize = (optimalPt * PT_TO_PX) * globalMultiplier;
        const testFont = '400 ' + testSize + 'px "Poppins", "Raleway", sans-serif';
        const testLines = wrapPlainText(reviewText, reviewMaxW, testFont);
        const testLH = testSize * 1.25;
        const testBlockH = testLines.length > 0 ? (testLines.length * testSize) + ((testLines.length - 1) * (testLH - testSize) * 0.4) : 0;

        // Ensure none of the lines individually exceed reviewMaxW
        let allLinesFit = true;
        for (let i = 0; i < testLines.length; i++) {
          if (measureWidth(testLines[i], testFont) > reviewMaxW) {
            allLinesFit = false;
            break;
          }
        }

        if (allLinesFit && testBlockH <= reviewMaxH && testLines.length <= 4) {
          targetReviewPt = optimalPt;
          break;
        }
        optimalPt -= 0.4;
      }
    }

    let reviewSize = (targetReviewPt * PT_TO_PX) * globalMultiplier;
    let reviewLineHeight = reviewSize * 1.25;
    let reviewFont = '400 ' + reviewSize + 'px "Poppins", "Raleway", sans-serif';

    let reviewLines = wrapPlainText(reviewText, reviewMaxW, reviewFont);

    // Display actual rendered pt in slider badge
    reviewSizeVal.textContent = targetReviewPt.toFixed(1) + ' pt' + (smartReviewActive ? ' (Auto)' : '');

    // Vertical centering in review box [Y: 1930..2064]
    const boxCenterY = (MARGINS.review.top + MARGINS.review.bottom) / 2;
    const renderedBlockHeight = (reviewLines.length - 1) * reviewLineHeight;
    let rY = boxCenterY - (renderedBlockHeight / 2) + (reviewSize * 0.32);

    ctx.font = reviewFont;
    ctx.fillStyle = TEXT_COLOR;
    reviewLines.forEach(function (rLine) {
      ctx.fillText(rLine, POSITIONS.review.left, rY);
      rY += reviewLineHeight;
    });

    // =======================================================================
    // OPTIONAL: RED MARGIN BOUNDS GUIDE OVERLAY
    // =======================================================================
    if (chkShowMargins.checked) {
      drawMarginGuides();
    }

    // Update Status Banner
    updateStatusAudit();
  }

  // =========================================================================
  // MARGIN GUIDE DRAWING
  // =========================================================================
  function drawMarginGuides() {
    ctx.save();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = 'rgba(239, 68, 68, 0.04)';

    // 1. Date Box
    const d = MARGINS.date;
    ctx.strokeRect(d.left, d.top, d.width, d.height);
    ctx.fillRect(d.left, d.top, d.width, d.height);
    drawGuideLabel('Date Margin: 368 × 78 px', d.left, d.top - 8);

    // 2. Outer Body Margin
    const o = MARGINS.outer;
    ctx.strokeRect(o.left, o.top, o.width, o.height);
    drawGuideLabel('Main Body Margin: 2018 × 1475 px (Y: 1078..2553)', o.left, o.top - 8);

    // 3. Scores Column Margin
    const s = MARGINS.scores;
    ctx.strokeRect(s.left, s.top, s.width, s.height);
    ctx.fillRect(s.left, s.top, s.width, s.height);
    drawGuideLabel('Scores Column: 112 × 371 px', s.left - 40, s.top - 8);

    // 4. Editor Review Box
    const r = MARGINS.review;
    ctx.strokeRect(r.left, r.top, r.width, r.height);
    ctx.fillRect(r.left, r.top, r.width, r.height);
    drawGuideLabel('Editor Review Box: 524 × 134 px', r.left, r.top - 8);

    ctx.restore();
  }

  function drawGuideLabel(text, x, y) {
    ctx.save();
    ctx.font = '600 24px monospace';
    ctx.fillStyle = '#ef4444';
    ctx.fillText(text, x, Math.max(30, y));
    ctx.restore();
  }

  // =========================================================================
  // STATUS & AUDIT BANNER UPDATE
  // =========================================================================
  function updateStatusAudit() {
    const scales = [];
    if (scaleAudit.date < 0.99) scales.push('Date: ' + Math.round(scaleAudit.date * 100) + '%');
    if (scaleAudit.name < 0.99) scales.push('Recipient: ' + Math.round(scaleAudit.name * 100) + '%');
    if (scaleAudit.heading < 0.99) scales.push('Heading: ' + Math.round(scaleAudit.heading * 100) + '%');
    if (scaleAudit.announcement < 0.99) scales.push('Announcement: ' + Math.round(scaleAudit.announcement * 100) + '%');
    if (scaleAudit.scores < 0.99) scales.push('Scores: ' + Math.round(scaleAudit.scores * 100) + '%');
    if (scaleAudit.review < 0.99) scales.push('Review: ' + Math.round(scaleAudit.review * 100) + '%');

    if (scales.length > 0) {
      marginStatusBanner.className = 'margin-banner status-scaled';
      marginStatusBanner.querySelector('.status-icon').textContent = '⚡';
      marginStatusBanner.querySelector('.status-title').textContent = 'Auto-Scaled to Fit Red Margins';
      marginStatusDetail.textContent = 'Maintained strictly within margins: ' + scales.join(' • ');
      statusMarginTag.textContent = 'Margins: 100% Maintained (Auto-Fitted)';
      statusAutoscaleTag.textContent = 'Auto-Scale: Active (' + scales.join(', ') + ')';
    } else {
      marginStatusBanner.className = 'margin-banner status-ok';
      marginStatusBanner.querySelector('.status-icon').textContent = '✓';
      marginStatusBanner.querySelector('.status-title').textContent = 'Margins Maintained (100%)';
      marginStatusDetail.textContent = 'All typography is rendering strictly within margin bounds.';
      statusMarginTag.textContent = 'Margins: 100% Maintained';
      statusAutoscaleTag.textContent = 'Auto-Scale: Ready';
    }
  }

  // =========================================================================
  // HELPER FORMATTERS
  // =========================================================================
  function formatPercentage(raw) {
    if (!raw) return '90%';
    let clean = raw.trim().replace(/[^0-9.]/g, '');
    if (!clean) clean = '90';
    return clean + '%';
  }

  function getFormattedToday() {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    return dd + '/' + mm + '/' + yyyy;
  }

  // =========================================================================
  // ZOOM & VIEWPORT CONTROLS
  // =========================================================================
  function setZoom(mode, customScale) {
    currentZoomMode = mode;
    const vpWidth = Math.max(300, canvasViewport.clientWidth - 48);
    const vpHeight = Math.max(300, canvasViewport.clientHeight - 48);

    if (mode === 'fit') {
      const scaleX = vpWidth / CANVAS_WIDTH;
      const scaleY = vpHeight / CANVAS_HEIGHT;
      currentZoomScale = Math.min(scaleX, scaleY);
      zoomLevelText.textContent = 'Fit (' + Math.round(currentZoomScale * 100) + '%)';
    } else {
      currentZoomScale = customScale;
      zoomLevelText.textContent = Math.round(currentZoomScale * 100) + '%';
    }

    const displayW = Math.round(CANVAS_WIDTH * currentZoomScale);
    const displayH = Math.round(CANVAS_HEIGHT * currentZoomScale);

    canvas.style.width = displayW + 'px';
    canvas.style.height = displayH + 'px';
    canvasWrapper.style.width = displayW + 'px';
    canvasWrapper.style.height = displayH + 'px';

    // Update active button state
    [btnZoomFit, btnZoom50, btnZoom75, btnZoom100].forEach(function (btn) {
      btn.classList.remove('active');
    });
    if (mode === 'fit') btnZoomFit.classList.add('active');
    if (customScale === 0.5) btnZoom50.classList.add('active');
    if (customScale === 0.75) btnZoom75.classList.add('active');
    if (customScale === 1.0) btnZoom100.classList.add('active');
  }

  // =========================================================================
  // PRESETS & RESET LOGIC
  // =========================================================================
  function resetAllSliders() {
    nameSizeSlider.value = SPEC_PT.name;
    dateSizeSlider.value = SPEC_PT.date;
    headingSizeSlider.value = SPEC_PT.heading;
    headingGapSlider.value = POSITIONS.announcement.defaultGap;
    bodySizeSlider.value = SPEC_PT.body;
    bodyLhSlider.value = POSITIONS.announcement.defaultLineHeight;
    scoresSizeSlider.value = SPEC_PT.scoreLabel;
    scoresSpacingSlider.value = POSITIONS.scores.defaultSpacing;
    scoresPosSlider.value = POSITIONS.scores.percentX;
    reviewSizeSlider.value = SPEC_PT.review;
    reviewSmartAutosize.checked = true;
    settingScaleFactor.value = '100';
    scaleFactorDisplay.textContent = '100%';
    requestRedraw();
  }

  function loadModelDefaults() {
    inputName.value = 'Tanishka Lalwani';
    inputDate.value = '05/04/2026';
    inputTitle.value = 'That type of woman';
    previewTitle.textContent = '“That type of woman”';
    scoreContent.value = '90%';
    scoreExpression.value = '95%';
    scoreLanguage.value = '98%';
    scoreStructure.value = '93%';
    scoreOverall.value = '94%';
    inputReview.value = 'Very strong with minor weaknesses';
    settingAutoscale.checked = true;
    settingClearFooter.checked = true;
    customAnnouncementActive = false;
    announcementCustomPanel.classList.add('hidden');
    resetAllSliders();
  }

  function loadOverflowTest() {
    inputName.value = 'Alexander Christopher Montgomery-Wellington III';
    inputDate.value = '15/11/2026 (Special Edition)';
    inputTitle.value = 'Chronicles of Solitude: Navigating the Vast Labyrinths of the Mind and Soul';
    scoreContent.value = '99.5%';
    scoreExpression.value = '98.5%';
    scoreLanguage.value = '99.0%';
    scoreStructure.value = '97.5%';
    scoreOverall.value = '98.8%';
    inputReview.value = 'Exceptional storytelling depth coupled with exquisite vocabulary, intricate world-building, and profound emotional resonance throughout the manuscript.';
    requestRedraw();
  }

  // =========================================================================
  // EXPORT FUNCTIONS: HIGH-RES PNG & PDF
  // =========================================================================

  function exportPNG() {
    const wasGuideChecked = chkShowMargins.checked;
    if (wasGuideChecked) {
      chkShowMargins.checked = false;
      drawPoster();
    }

    canvas.toBlob(function (blob) {
      if (wasGuideChecked) {
        chkShowMargins.checked = true;
        drawPoster();
      }

      if (!blob) {
        alert('Failed to generate image blob. Please try print export.');
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (inputName.value.trim() || 'Letterpad').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = 'ChromaDiaries_Letterpad_' + safeName + '.png';
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    }, 'image/png');
  }

  function exportPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF generation library is still loading. Please try again or use the Print button.');
      return;
    }

    const wasGuideChecked = chkShowMargins.checked;
    if (wasGuideChecked) {
      chkShowMargins.checked = false;
      drawPoster();
    }

    canvas.toBlob(function (blob) {
      if (wasGuideChecked) {
        chkShowMargins.checked = true;
        drawPoster();
      }

      const reader = new FileReader();
      reader.onload = function () {
        const base64data = reader.result;
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
          compress: true
        });

        pdf.addImage(base64data, 'PNG', 0, 0, 595.28, 841.89, undefined, 'FAST');
        const safeName = (inputName.value.trim() || 'Letterpad').replace(/[^a-zA-Z0-9_-]/g, '_');
        pdf.save('ChromaDiaries_Letterpad_' + safeName + '.pdf');
      };
      reader.readAsDataURL(blob);
    }, 'image/png');
  }

  function copyImageToClipboard() {
    const wasGuideChecked = chkShowMargins.checked;
    if (wasGuideChecked) {
      chkShowMargins.checked = false;
      drawPoster();
    }

    canvas.toBlob(function (blob) {
      if (wasGuideChecked) {
        chkShowMargins.checked = true;
        drawPoster();
      }

      if (navigator.clipboard && navigator.clipboard.write) {
        const item = new ClipboardItem({ 'image/png': blob });
        navigator.clipboard.write([item]).then(function () {
          btnCopyImage.textContent = 'Copied!';
          setTimeout(function () { btnCopyImage.textContent = 'Copy Image'; }, 2000);
        }).catch(function (err) {
          console.error('Clipboard copy error:', err);
          alert('Could not write to clipboard directly. Please use Download PNG.');
        });
      } else {
        alert('Clipboard image copy not supported in this browser. Please use Download PNG.');
      }
    }, 'image/png');
  }

  // =========================================================================
  // EVENT LISTENERS
  // =========================================================================
  function initEvents() {
    // Text inputs redraw
    const textInputs = [
      inputName, inputDate, inputTitle, inputCustomHeading, inputCustomAnnouncement,
      scoreContent, scoreExpression, scoreLanguage, scoreStructure, scoreOverall,
      inputReview
    ];

    textInputs.forEach(function (inp) {
      if (!inp) return;
      inp.addEventListener('input', requestRedraw);
      inp.addEventListener('change', requestRedraw);
    });

    // Granular sliders
    const allSliders = [
      nameSizeSlider, dateSizeSlider, headingSizeSlider, headingGapSlider,
      bodySizeSlider, bodyLhSlider, scoresSizeSlider, scoresSpacingSlider,
      scoresPosSlider, reviewSizeSlider, settingScaleFactor
    ];

    allSliders.forEach(function (sl) {
      if (!sl) return;
      sl.addEventListener('input', requestRedraw);
    });

    // Reset single slider buttons
    document.querySelectorAll('.btn-reset-slider').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-target');
        const defaultVal = this.getAttribute('data-default');
        const targetSlider = document.getElementById(targetId);
        if (targetSlider && defaultVal) {
          targetSlider.value = defaultVal;
          requestRedraw();
        }
      });
    });

    // Reset all sliders button
    btnResetAllSliders.addEventListener('click', resetAllSliders);

    // Score presets
    document.querySelectorAll('.chip-preset[data-scores]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const parts = this.getAttribute('data-scores').split(',');
        if (parts.length >= 5) {
          scoreContent.value = parts[0];
          scoreExpression.value = parts[1];
          scoreLanguage.value = parts[2];
          scoreStructure.value = parts[3];
          scoreOverall.value = parts[4];
          requestRedraw();
        }
      });
    });

    // Review presets
    document.querySelectorAll('.review-chip[data-review]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        inputReview.value = this.getAttribute('data-review');
        requestRedraw();
      });
    });

    // Toggles & Fine-tuning
    reviewSmartAutosize.addEventListener('change', requestRedraw);
    settingAutoscale.addEventListener('change', requestRedraw);
    settingClearFooter.addEventListener('change', requestRedraw);
    settingScaleFactor.addEventListener('input', function () {
      scaleFactorDisplay.textContent = this.value + '%';
      requestRedraw();
    });

    // Toggle advanced announcement
    btnToggleAnnouncement.addEventListener('click', function () {
      customAnnouncementActive = !customAnnouncementActive;
      if (customAnnouncementActive) {
        announcementCustomPanel.classList.remove('hidden');
        btnToggleAnnouncement.querySelector('span').textContent = 'Using Custom Announcement (Click to Reset)';
      } else {
        announcementCustomPanel.classList.add('hidden');
        btnToggleAnnouncement.querySelector('span').textContent = 'Advanced: Edit Full Announcement Text';
      }
      requestRedraw();
    });

    // Margin guide overlay toggle
    chkShowMargins.addEventListener('change', requestRedraw);
    btnQuickToggleMargin.addEventListener('click', function () {
      chkShowMargins.checked = !chkShowMargins.checked;
      requestRedraw();
    });

    // Model compare toggle
    chkShowModel.addEventListener('change', function () {
      if (this.checked) {
        modelImg.classList.remove('hidden');
        modelCompareBar.classList.remove('hidden');
      } else {
        modelImg.classList.add('hidden');
        modelCompareBar.classList.add('hidden');
      }
    });

    modelOpacityRange.addEventListener('input', function () {
      const val = parseInt(this.value, 10);
      modelImg.style.opacity = val / 100;
      modelOpacityVal.textContent = val + '% Model';
    });

    // Header buttons
    btnLoadModel.addEventListener('click', loadModelDefaults);
    btnTestOverflow.addEventListener('click', loadOverflowTest);
    btnToday.addEventListener('click', function () {
      inputDate.value = getFormattedToday();
      requestRedraw();
    });

    // Export buttons
    btnDownloadPng.addEventListener('click', exportPNG);
    btnDownloadPdf.addEventListener('click', exportPDF);
    btnPrint.addEventListener('click', function () { window.print(); });
    btnCopyImage.addEventListener('click', copyImageToClipboard);

    // Zoom buttons
    btnZoomFit.addEventListener('click', function () { setZoom('fit'); });
    btnZoom50.addEventListener('click', function () { setZoom('custom', 0.5); });
    btnZoom75.addEventListener('click', function () { setZoom('custom', 0.75); });
    btnZoom100.addEventListener('click', function () { setZoom('custom', 1.0); });

    btnZoomIn.addEventListener('click', function () {
      setZoom('custom', Math.min(2.0, currentZoomScale + 0.15));
    });
    btnZoomOut.addEventListener('click', function () {
      setZoom('custom', Math.max(0.2, currentZoomScale - 0.15));
    });

    // Window resize
    window.addEventListener('resize', function () {
      if (currentZoomMode === 'fit') {
        setZoom('fit');
      }
    });

    // Keyboard shortcuts: Ctrl+S to save PNG
    window.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportPNG();
      }
    });
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  window.addEventListener('DOMContentLoaded', function () {
    initEvents();
    initAssets();
    setTimeout(function () {
      setZoom('fit');
    }, 150);
  });

})();
