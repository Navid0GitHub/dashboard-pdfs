if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
let canvas = document.getElementById('pdfCanvas');
let ctx = canvas.getContext('2d');

function renderPage(num) {
    pageRendering = true;
    
    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        const renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.getElementById('pageInfo').textContent = `صفحه ${num} از ${pdfDoc.numPages}`;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

function zoomIn() {
    scale = Math.min(scale + 0.25, 3.0);
    document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';
    queueRenderPage(pageNum);
}

function zoomOut() {
    scale = Math.max(scale - 0.25, 0.5);
    document.getElementById('zoomLevel').textContent = Math.round(scale * 100) + '%';
    queueRenderPage(pageNum);
}

document.getElementById('prevPage').addEventListener('click', onPrevPage);
document.getElementById('nextPage').addEventListener('click', onNextPage);
document.getElementById('zoomIn').addEventListener('click', zoomIn);
document.getElementById('zoomOut').addEventListener('click', zoomOut);

document.getElementById('logout').addEventListener('click', function() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        onNextPage();
    } else if (e.key === 'ArrowRight') {
        onPrevPage();
    } else if (e.key === '+' || e.key === '=') {
        zoomIn();
    } else if (e.key === '-') {
        zoomOut();
    }
});

const pdfUrl = 'PDF/partner dashboard status.pdf';

pdfjsLib.getDocument(pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('pageInfo').textContent = `صفحه 1 از ${pdfDoc.numPages}`;
    renderPage(pageNum);
}).catch(function(error) {
    console.error('Error loading PDF:', error);
    alert('خطا در بارگذاری فایل PDF');
});