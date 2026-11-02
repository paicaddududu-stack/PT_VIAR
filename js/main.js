document.addEventListener('DOMContentLoaded',()=>{
  const menuButton=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
  if(menuButton&&nav){menuButton.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));menuButton.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>';});
    document.querySelectorAll('.nav-dropdown>a').forEach(link=>link.addEventListener('click',e=>{if(window.matchMedia('(max-width:760px)').matches){const parent=link.parentElement;if(!parent.classList.contains('open')){e.preventDefault();parent.classList.add('open')}}}));
  }
  const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();
  // Interactive history timeline
  const timeline=document.getElementById('timelineContainer');
  document.getElementById('scrollLeft')?.addEventListener('click',()=>timeline?.scrollBy({left:-300,behavior:'smooth'}));
  document.getElementById('scrollRight')?.addEventListener('click',()=>timeline?.scrollBy({left:300,behavior:'smooth'}));
  // Hero carousel
  const slides=[...document.querySelectorAll('.hero-slide')],dots=[...document.querySelectorAll('.hero-dots button')];let current=0,timer;
  function showSlide(i){if(!slides.length)return;current=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===current));dots.forEach((d,n)=>d.classList.toggle('active',n===current));const index=document.querySelector('.hero-index strong');if(index)index.textContent=String(current+1).padStart(2,'0');}
  function restart(){clearInterval(timer);if(slides.length>1)timer=setInterval(()=>showSlide(current+1),6500)}
  document.querySelector('.hero-prev')?.addEventListener('click',()=>{showSlide(current-1);restart()});document.querySelector('.hero-next')?.addEventListener('click',()=>{showSlide(current+1);restart()});dots.forEach((d,i)=>d.addEventListener('click',()=>{showSlide(i);restart()}));restart();
  // Product filters and search
  const items=[...document.querySelectorAll('.product-item')],filterButtons=[...document.querySelectorAll('.filter-btn')],search=document.getElementById('productSearch'),empty=document.getElementById('emptyState');let category=new URLSearchParams(location.search).get('series')||'all';
  const normalizeText=value=>(value||'').toString().toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  function filterProducts(){
    const query=normalizeText(search?.value||'');let count=0;
    items.forEach(item=>{
      const matchCategory=category==='all'||item.classList.contains(category);
      const haystack=normalizeText([item.dataset.name,item.textContent].join(' '));
      const visible=matchCategory&&(!query||haystack.includes(query));
      item.hidden=!visible;if(visible)count++;
    });
    filterButtons.forEach(b=>b.classList.toggle('active',b.dataset.filter===category));
    if(empty)empty.hidden=count>0;
    const total=filterButtons.find(b=>b.dataset.filter==='all');
    if(total)total.innerHTML=`Semua Produk <span>${items.length}</span>`;
  }
  filterButtons.forEach(btn=>btn.addEventListener('click',()=>{category=btn.dataset.filter;filterProducts();history.replaceState(null,'',category==='all'?'#produk':`?series=${category}#produk`)}));
  search?.addEventListener('input',filterProducts);
  search?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();document.getElementById('produk')?.scrollIntoView({behavior:'smooth',block:'start'});}});
  document.getElementById('resetFilters')?.addEventListener('click',()=>{category='all';if(search)search.value='';filterProducts()});
  if(items.length){if(!['all','karya','agri','adventure','ev'].includes(category))category='all';filterProducts()}

  // Dealer finder: city dropdown and free-text search work together.
  const dealerCards=[...document.querySelectorAll('.dealer-card')];
  const dealerSearch=document.getElementById('dealerSearch');
  const dealerCity=document.getElementById('dealerCity');
  const dealerEmpty=document.getElementById('dealerEmpty');
  function filterDealers(scrollToResults=false){
    const query=normalizeText(dealerSearch?.value||'');
    const city=normalizeText(dealerCity?.value||'all');let count=0;
    dealerCards.forEach(card=>{
      const cardCity=normalizeText(card.dataset.city||'');
      const content=normalizeText(card.textContent);
      const matchCity=city==='all'||cardCity===city;
      const matchQuery=!query||content.includes(query)||cardCity.includes(query);
      const visible=matchCity&&matchQuery;
      card.hidden=!visible;if(visible)count++;
    });
    if(dealerEmpty)dealerEmpty.hidden=count>0;
    if(scrollToResults)document.getElementById('dealerGrid')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  dealerSearch?.addEventListener('input',()=>filterDealers());
  dealerSearch?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();filterDealers(true)}});
  dealerCity?.addEventListener('change',()=>filterDealers(true));
  filterDealers();
  // Detail product content driven by query string
  const products={
    'karya-bit':{title:'KARYA BIT n',category:'KENDARAAN NIAGA',badge:'KARYA SERIES',desc:'Kendaraan roda tiga ringkas untuk mendukung distribusi barang dan kegiatan usaha harian.',price:'Rp 18.900.000',image:'img/karya-niaga.png',specs:[['Kategori','Kendaraan niaga roda tiga'],['Mesin','150 cc, 4 langkah'],['Transmisi','Manual 4 percepatan'],['Bahan bakar','Bensin'],['Kapasitas angkut','400 kg'],['Sistem pengereman','Tromol depan-belakang '],['Penggunaan','Distribusi barang, toko, dan usaha kecil']],points:['Dimensi ringkas untuk area operasional yang padat.','Bak angkut untuk kebutuhan distribusi harian.','Konfigurasi sederhana yang mudah dipahami pengguna.']},
    'karya-150':{title:'KARYA 150 RL n',category:'KENDARAAN NIAGA',badge:'KARYA SERIES',desc:'Pilihan kendaraan niaga untuk membantu usaha mengirim barang dan menjalankan aktivitas operasional.',price:'Rp 24.500.000',image:'img/karya-niaga-detail.png',specs:[['Kategori','Kendaraan niaga roda tiga'],['Mesin','150 cc, 4 langkah'],['Transmisi','Manual 4 percepatan'],['Bahan bakar','Bensin'],['Kapasitas angkut','500 kg'],['Suspensi','Depan teleskopik, belakang per daun '],['Penggunaan','Perdagangan, logistik lokal, dan usaha rumahan']],points:['Kendaraan untuk operasional rutin.','Ruang angkut mendukung kebutuhan barang dagangan.','Cocok dijadikan opsi untuk usaha yang berkembang.']},
    'karya-200':{title:'KARYA 200 LONG',category:'KENDARAAN NIAGA',badge:'KARYA SERIES',desc:'Kendaraan niaga dengan  bak lebih panjang untuk kebutuhan angkut yang beragam.',price:'Rp 29.900.000',image:'img/karya-niaga-side.png',specs:[['Kategori','Kendaraan niaga roda tiga'],['Mesin','200 cc, 4 langkah'],['Transmisi','Manual 5 percepatan'],['Bahan bakar','Bensin'],['Kapasitas angkut','600 kg'],['Bak','Tipe panjang'],['Penggunaan','Distribusi bahan, hasil usaha, dan perlengkapan']],points:['Bak panjang untuk barang berukuran lebih besar.','Ditujukan untuk kegiatan usaha dan distribusi.','Periksa dimensi bak dan batas muatan sebelum digunakan.']},
    'karya-300':{title:'KARYA 300 N',category:'KENDARAAN NIAGA',badge:'KARYA SERIES',desc:'Kendaraan angkut untuk mendukung pekerjaan dan distribusi dengan kebutuhan muatan lebih besar.',price:'Rp 32.500.000',image:'img/karya-niaga.png',specs:[['Kategori','Kendaraan niaga roda tiga'],['Mesin','200–300 cc'],['Transmisi','Manual'],['Bahan bakar','Bensin'],['Kapasitas angkut','700 kg'],['Bak','Bak angkut serbaguna'],['Penggunaan','Usaha distribusi dan operasional lapangan']],points:['Kapasitas muatan untuk kegiatan usaha.','Bak serbaguna untuk berbagai jenis barang.','Kapasitas aktual harus mengikuti spesifikasi resmi dan aturan keselamatan.']},
    'agri':{title:'AGRI SERIES',category:'SOLUSI PERTANIAN',badge:'AGRI SERIES',desc:'Kategori kendaraan dan peralatan mobilitas yang dirancang untuk membantu aktivitas di lingkungan pertanian.',price:'Rp 16.800.000',image:'img/agri-kebun.png',specs:[['Kategori','Kendaraan dan alat bantu pertanian'],['Penggerak','Mesin bensin 4 langkah'],['Transmisi','Manual'],['Bahan bakar','Bensin'],['Rancangan penggunaan','Jalur kebun dan lahan kerja'],['Fitur ','Rangka fungsional dan ban berprofil'],['Catatan','Model dan konfigurasi perlu dipilih sesuai katalog resmi']],points:['Diarahkan untuk mendukung mobilitas di area pertanian.','Penggunaan untuk kebun dan kegiatan lapangan.','Pastikan jenis model sesuai kontur medan dan beban kerja.']},
    'adventure':{title:'ADVENTURE SERIES',category:'MOBILITAS',badge:'ADVENTURE',desc:'Kategori kendaraan untuk pengendara yang menyukai aktivitas luar ruang dan perjalanan rekreatif.',price:'Rp 18.500.000',image:'img/adventure-motor.png',specs:[['Kategori','Motor adventure'],['Mesin','100–150 cc'],['Transmisi','Manual'],['Bahan bakar','Bensin'],['Suspensi','Suspensi dengan jarak main panjang'],['Ban','Ban berprofil untuk variasi permukaan'],['Penggunaan','Perjalanan dan aktivitas rekreatif']],points:['Gaya desain yang terinspirasi aktivitas luar ruang.','Konsep ergonomi untuk perjalanan santai.','Periksa spesifikasi model yang dipilih sebelum melakukan pembelian.']},
    'ev':{title:'ELECTRIC VEHICLE',category:'MOBILITAS ELEKTRIK',badge:'ELECTRIC VEHICLE',desc:'Kategori kendaraan listrik untuk kebutuhan mobilitas yang praktis dan lebih senyap.',price:'Rp 12.900.000',image:'img/electric-scooter.png',specs:[['Kategori','Kendaraan listrik'],['Motor listrik','1.000 W'],['Baterai','Lithium 60 V'],['Jarak tempuh','40–60 km per pengisian'],['Waktu pengisian','4–6 jam'],['Kecepatan maksimum','25–40 km/jam'],['Penggunaan','Mobilitas jarak dekat dan area operasional']],points:['Penggerak listrik untuk pengalaman berkendara yang senyap.','Konsep pengisian ulang untuk mobilitas jarak dekat.','Jarak tempuh dipengaruhi beban, medan, gaya berkendara, dan kondisi baterai.']},
    'karya-lain':{title:'PILIHAN KARYA LAINNYA',category:'KENDARAAN NIAGA',badge:'KARYA SERIES',desc:'Kumpulan pilihan kendaraan niaga untuk kebutuhan usaha yang berbeda-beda.',price:'Mulai Rp 18.900.000',image:'img/viar-lineup.png',specs:[['Kategori','Kendaraan niaga'],['Pilihan mesin','Bervariasi menurut model'],['Transmisi','Mengikuti tipe kendaraan'],['Bahan bakar','Mengikuti tipe kendaraan'],['Kapasitas angkut','Mengikuti spesifikasi model'],['Fitur','Dapat berbeda sesuai varian'],['Penggunaan','Usaha, perdagangan, dan distribusi']],points:['Pilih tipe berdasarkan jenis barang dan frekuensi penggunaan.','Bandingkan kapasitas angkut serta dimensi kendaraan.','Harga dan spesifikasi mengikuti varian yang dipilih.']}
  };
  const key=new URLSearchParams(location.search).get('product')||'karya-bit',p=products[key]||products['karya-bit'];
  const setText=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
  setText('detailTitle',p.title+' Series.');setText('detailHeading',p.title);setText('detailCategory',p.category);setText('detailBadge',p.badge);setText('detailDescription',p.desc);
  setText('detailPrice',p.price);
  const specs=document.getElementById('detailSpecs');if(specs)specs.innerHTML=p.specs.map(([label,value])=>`<article class="spec-text-card"><span>${label}</span><strong>${value}</strong></article>`).join('');
  const order=document.getElementById('orderProduct');if(order)order.href='https://wa.me/6281998992776?text='+encodeURIComponent('Halo Viar, saya tertarik dengan '+p.title+'. Mohon informasi harga dan ketersediaan produk.');
  const points=document.getElementById('detailPoints');if(points)points.innerHTML=p.points.map(item=>`<li><i class="fa-solid fa-check"></i><span>${item}</span></li>`).join('');
  const detailImage=document.getElementById('detailImage');if(detailImage){detailImage.src=p.image;detailImage.alt='Ilustrasi kategori '+p.title}
  document.querySelectorAll('.thumb').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.thumb').forEach(b=>b.classList.remove('active'));btn.classList.add('active');if(detailImage)detailImage.src=btn.dataset.image}));
  if(location.hash==='#spesifikasi'){requestAnimationFrame(()=>document.getElementById('spesifikasi')?.scrollIntoView({behavior:'smooth',block:'start'}));}

  // Gallery lightbox: open image overlay and close with button, backdrop, or Escape.
  const galleryLinks=[...document.querySelectorAll('[data-lightbox="gallery"]')];
  if(galleryLinks.length){const overlay=document.createElement('div');overlay.className='gallery-lightbox';overlay.innerHTML='<button class="lightbox-close" aria-label="Tutup galeri"><i class="fa-solid fa-xmark"></i></button><button class="lightbox-prev" aria-label="Foto sebelumnya"><i class="fa-solid fa-chevron-left"></i></button><figure><img alt=""><figcaption></figcaption></figure><button class="lightbox-next" aria-label="Foto berikutnya"><i class="fa-solid fa-chevron-right"></i></button>';document.body.appendChild(overlay);let gi=0;const lbImg=overlay.querySelector('img'),cap=overlay.querySelector('figcaption');function show(i){gi=(i+galleryLinks.length)%galleryLinks.length;const a=galleryLinks[gi];lbImg.src=a.href;lbImg.alt=a.querySelector('img')?.alt||'Galeri VIAR';cap.textContent=a.querySelector('span')?.textContent.trim()||lbImg.alt;overlay.classList.add('open');document.body.classList.add('lightbox-open')}function close(){overlay.classList.remove('open');document.body.classList.remove('lightbox-open');lbImg.src=''}galleryLinks.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();show(i)}));overlay.querySelector('.lightbox-close').addEventListener('click',close);overlay.querySelector('.lightbox-prev').addEventListener('click',()=>show(gi-1));overlay.querySelector('.lightbox-next').addEventListener('click',()=>show(gi+1));overlay.addEventListener('click',e=>{if(e.target===overlay)close()});document.addEventListener('keydown',e=>{if(!overlay.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(gi-1);if(e.key==='ArrowRight')show(gi+1)})}

  // Contact form opens a composed WhatsApp message, never sends it silently.
  const form=document.getElementById('contactForm');form?.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const message=['Halo Viar Motor Indonesia, saya ingin bertanya.','',`Nama: ${data.get('fullName')}`,`Email: ${data.get('email')||'-'}`,`Nomor telepon: ${data.get('phone')||'-'}`,`Kota/Kabupaten: ${data.get('city')}`,`Topik: ${data.get('topic')}`,`Pesan: ${data.get('message')}`].join('\n');const feedback=document.getElementById('formFeedback');if(feedback)feedback.textContent='Pesan sudah disiapkan. WhatsApp akan dibuka pada tab baru; periksa nomor tujuan resmi sebelum mengirim.';const url='https://wa.me/6281998992741?text='+encodeURIComponent(message);window.open(url,'_blank','noopener,noreferrer')});
});

// Pastikan gambar yang gagal dimuat tidak meninggalkan kotak kosong.
document.querySelectorAll('img').forEach((img) => {
  img.addEventListener('error', function onImageError() {
    if (this.dataset.fallbackTried) return;
    this.dataset.fallbackTried = '1';
    this.src = 'img/karya-niaga.png';
  }, { once: true });
});
