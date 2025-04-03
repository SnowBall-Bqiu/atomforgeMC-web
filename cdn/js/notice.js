const modal = document.getElementById('announcementModal');
const closeButton = document.querySelector('.close-button');
const announcementTitle = document.getElementById('announcementTitle');
const announcementText = document.getElementById('announcementText');
const announcementButton = document.getElementById('announcementButton');
const announcementFile = 'https://www.atomforge.ru/word/notice/notice.txt'; // 公告文件路径
const cookieName = 'snowball_web_announcements_cookie';          // Cookie 名称
const cookieExpiryDays = 1;                 // Cookie 过期天数

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

function showAnnouncement(title, text, buttonText) {
  announcementTitle.textContent = title;
  announcementText.textContent = text;
  announcementButton.textContent = buttonText || '知道了';
  modal.style.display = 'block';
}

function hideAnnouncement() {
  modal.classList.add('fadeOut');
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fadeOut');
  }, 200);
    setCookie(cookieName, 'true', cookieExpiryDays);  //设置Cookie
}

closeButton.addEventListener('click', hideAnnouncement);
announcementButton.addEventListener('click', hideAnnouncement);

async function loadAndShowAnnouncement() {
  // 检查是否已阅读过公告
  if (getCookie(cookieName)) {
    return; // 如果已阅读，则不显示公告
  }

  try {
    const response = await fetch(announcementFile);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    const announcements = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line); // 去除空行

    if (announcements.length > 0) {
      const randomIndex = Math.floor(Math.random() * announcements.length);
      const announcement = announcements[randomIndex];
      showAnnouncement('RC Admin提醒您', announcement, '我了解了');
    }
  } catch (error) {
    console.error('Failed to load announcements:', error);
    showAnnouncement('网站公告', '暂时没有公告', '知道了'); // 显示默认公告或提示
  }
}

// 页面加载时显示公告
window.onload = function() {
    loadAndShowAnnouncement()
};