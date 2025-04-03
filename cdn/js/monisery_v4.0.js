document.addEventListener('DOMContentLoaded', () => {
    // 自动调整iframe高度
    const iframes = document.querySelectorAll('iframe');
    
    const setHeight = (iframe) => {
        try {
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            const height = Math.max(
                doc.body.scrollHeight,
                doc.documentElement.scrollHeight,
                doc.body.offsetHeight,
                doc.documentElement.offsetHeight,
                doc.body.clientHeight,
                doc.documentElement.clientHeight
            );
            iframe.style.height = `${height}px`;
        } catch (error) {
            console.log('安全策略阻止高度获取，使用备用方案');
            iframe.style.height = '100vh';
        }
    };

    // 监听跨域消息
    window.addEventListener('message', (e) => {
        iframes.forEach(iframe => {
            if (e.source === iframe.contentWindow) {
                iframe.style.height = `${e.data.height}px`;
            }
        });
    });

    // 初始化设置
    iframes.forEach(iframe => {
        // 设置标题属性
        const title = iframe.getAttribute('data-title');
        iframe.parentElement.setAttribute('data-title', title);

        // 基础高度设置
        iframe.onload = () => {
            setTimeout(() => setHeight(iframe), 1000);
        };
        
        // 定时更新高度
        setInterval(() => setHeight(iframe), 5000);
        
        // 向子页面发送通信脚本
        iframe.onload = () => {
            try {
                const script = `
                    <script>
                        setInterval(() => {
                            const height = document.documentElement.scrollHeight;
                            window.parent.postMessage({ 
                                height: height,
                                source: '${iframe.src}'
                            }, '*');
                        }, 1000);
                    <\/script>
                `;
                iframe.contentDocument.write(script);
            } catch (error) {
                console.log('跨域脚本注入被阻止');
            }
        };
    });
});