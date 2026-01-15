# MyBestWebsite

Bu küçük proje, `sites.json` dosyasından veri çekerek kategorilere ayrılmış favori sitelerinizi gösterir.

Sitenin GitHub Pages üzerinde yayınlanmış örneği:

https://ebubekiraydic.github.io/MyBestWebsite/

Nasıl çalışır
- **GitHub Pages:** Repo'yu GitHub'a push ettikten sonra Pages aktifse site doğrudan bu URL üzerinden açılır — herhangi bir sunucu çalıştırmanıza gerek yok.
- **Local çalışma:** İsterseniz yerel denemeler için basit bir HTTP sunucusu kullanabilirsiniz (opsiyonel):

```powershell
python -m http.server 8000
```

- **Veri kaydı:** Kullanıcı verileri `localStorage`'ta saklanır. İlk açılışta `sites.json` içeriği seed olarak alınır ve daha sonra yapılan değişiklikler tarayıcıda saklanır.
- **İçe / Dışa aktarma:** Toolbar'dan JSON indirebilir, panoya kopyalayabilir veya JSON dosyası yükleyerek verileri `Üstüne yaz` veya `Ekle` modlarında içe aktarabilirsiniz.

Kendi sitelerinizi eklemek/düzenlemek/silmek için sayfada bulunan formu kullanın. `sites.json`'ı düzenleyip indirerek paylaşabilir veya yedekleyebilirsiniz.

Destek veya geliştirme istekleri için repo'ya issue açabilirsiniz.
