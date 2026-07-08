/* BlazeRent Studio — zip.js
 * Minimal dependency-free ZIP writer (STORE method, no compression).
 * Good enough to bundle carousel PNGs into one download.
 */
window.BR = window.BR || {};

(function () {
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  /** files: [{name: 'slide-1.png', data: Uint8Array}] -> Blob (application/zip) */
  function makeZip(files) {
    const encoder = new TextEncoder();
    const localParts = [];
    const centralParts = [];
    let offset = 0;

    // DOS date/time of "now"
    const d = new Date();
    const dosTime = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
    const dosDate = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;

    const u16 = v => new Uint8Array([v & 255, (v >> 8) & 255]);
    const u32 = v => new Uint8Array([v & 255, (v >> 8) & 255, (v >> 16) & 255, (v >>> 24) & 255]);

    for (const f of files) {
      const nameBytes = encoder.encode(f.name);
      const crc = crc32(f.data);
      const size = f.data.length;

      const local = concat([
        u32(0x04034b50), u16(20), u16(0), u16(0), // sig, version, flags, method=store
        u16(dosTime), u16(dosDate),
        u32(crc), u32(size), u32(size),
        u16(nameBytes.length), u16(0),
        nameBytes, f.data
      ]);
      localParts.push(local);

      const central = concat([
        u32(0x02014b50), u16(20), u16(20), u16(0), u16(0),
        u16(dosTime), u16(dosDate),
        u32(crc), u32(size), u32(size),
        u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(offset),
        nameBytes
      ]);
      centralParts.push(central);
      offset += local.length;
    }

    const centralStart = offset;
    const centralBytes = concat(centralParts);
    const end = concat([
      u32(0x06054b50), u16(0), u16(0),
      u16(files.length), u16(files.length),
      u32(centralBytes.length), u32(centralStart),
      u16(0)
    ]);

    return new Blob([concat(localParts), centralBytes, end], { type: 'application/zip' });
  }

  function concat(arrays) {
    const total = arrays.reduce((a, b) => a + b.length, 0);
    const out = new Uint8Array(total);
    let pos = 0;
    for (const a of arrays) { out.set(a, pos); pos += a.length; }
    return out;
  }

  function downloadBlob(blob, filename) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

  BR.zip = { makeZip, downloadBlob };
})();
