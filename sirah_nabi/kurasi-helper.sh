#!/bin/bash

# Script untuk membantu kurasi database nabi
# Mencari pattern yang perlu diperbaiki

echo "=== KURASI DATABASE NABI ==="
echo "Mencari pattern yang perlu diperbaiki..."

# Cari info yang terlalu spesifik tanpa dalil
echo -e "\n1. INFO PERIODE YANG PERLU DIKURASI:"
grep -n "period.*tahun\|period.*M\|period.*SM" data/nabi-part*.js | head -10

echo -e "\n2. INFO TEMPAT LAHIR YANG PERLU DIKURASI:"
grep -n "birthPlace.*:" data/nabi-part*.js | head -10

echo -e "\n3. REFERENSI YANG PERLU DICEK:"
grep -n "references.*kitab\|references.*riwayat\|references.*menurut" data/nabi-part*.js | head -10

echo -e "\n4. INFO KELUARGA YANG PERLU DIKURASI:"
grep -n "father.*:\|mother.*:\|children.*:" data/nabi-part*.js | head -10

echo -e "\nSelesai scanning. Silakan review manual untuk kurasi."