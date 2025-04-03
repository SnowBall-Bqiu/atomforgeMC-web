document.addEventListener('DOMContentLoaded', function() {
  console.log('🐳 DOMContentLoaded事件触发！服务球开始加载资源...');

  // 1. 加载 CSS (从页面中获取)
  function loadInlineCSS(callback) {
    var styleTags = document.querySelectorAll('style');
    if (styleTags.length > 0) {
      console.log('🐳 找到内联CSS!');
      styleTags.forEach(function(styleTag) {
        // 将内联样式添加到 head 中
        document.head.appendChild(styleTag);
      });
      callback();
    } else {
      console.warn('🐳 没有找到内联CSS!');
      callback();
    }
  }

  // 2. 加载 JS (从页面中获取)
  function loadInlineJS(callback) {
    var scriptTags = document.querySelectorAll('script'); 
    if (scriptTags.length > 0) {
      console.log('🐳 找到内联JS!');
      // 这里可以添加一些处理JS的逻辑，例如执行
      callback(); // 直接执行回调，因为JS已经存在于页面中
    } else {
      console.warn('🐳 没有找到内联JS!');
      callback(); // 即使没找到，也执行回调，防止卡住
    }
  }

  // 3. 加载图片 (支持多种方式)
  function loadImages(callback) {
    var images = document.querySelectorAll('img[data-src]'); 
    var bgImages = document.querySelectorAll('[data-src]'); 
    var normalImages = document.querySelectorAll('img:not([data-src])');

    var totalImages = images.length + bgImages.length + normalImages.length;
    var loadedCount = 0;

    if (totalImages === 0) {
      console.log('🐳 qwq机器求没有找到需要加载的图片。');
      callback(); // 如果没有图片，直接执行回调
      return;
    }

    function imageLoaded() {
      loadedCount++;
      console.log('🐳 图片加载完成', loadedCount, '/', totalImages);
      if (loadedCount === totalImages) {
        console.log('🐳 图片加载完成！');
        callback(); // 所有图片加载完成后执行回调
      }
    }

    function loadImage(img, src) {
      img.onload = imageLoaded;
      img.onerror = function() {
        console.error('🐳 图片加载失败:', src);
        imageLoaded(); // 即使加载失败，也调用imageLoaded，防止卡住
      };
      img.src = src;
    }

    // 处理带有 data-src 的 img 标签
    images.forEach(function(img) {
      loadImage(img, img.dataset.src);
      img.removeAttribute('data-src');
    });

    // 处理带有 data-src 的背景图元素
    bgImages.forEach(function(element) {
      var src = element.dataset.src;
      element.style.backgroundImage = 'url("' + src + '")';
      element.removeAttribute('data-src');
      // 创建一个临时的 Image 对象来监听加载事件
      var tempImage = new Image();
      tempImage.onload = imageLoaded;
      tempImage.onerror = function() {
        console.error('🐳 背景图加载失败:', src);
        imageLoaded();
      };
      tempImage.src = src; // 加载图片
    });

    // 处理没有 data-src 的 img 标签
    normalImages.forEach(function(img) {
      loadImage(img, img.src);
    });
  }

  // 顺序加载资源
  loadInlineCSS(function() {
    loadInlineJS(function() {
      loadImages(function() {
      });
    });
  });

  console.log('🐳 资源加载流程已启动！');
});