import html2canvas from 'html2canvas';

const downloadBase64Handle = async (base64: string) => {
  try {
    const byteCharacters = atob(base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: undefined,
    });
    const blobUrl = window.URL.createObjectURL(blob);
    // 这里的文件名根据实际情况从响应头或者url里获取
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = `${Date.now()}.jpg`;
    downloadLink.click();
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(error);
    // 如果直接下载出现异常，还是要使用打开新的窗口来下载
    // window.open(url, '_blank');
  } finally {
  }
};
export const screenshot = (dom: HTMLElement) => {
  return new Promise((resolve, reject) => {
    html2canvas(dom)
      .then(function (canvas) {
        const base64 = canvas.toDataURL('image/jpeg', 1);
        downloadBase64Handle(base64);
        resolve(base64);
      })
      .catch(error => {
        reject(error);
      });
  });
};
