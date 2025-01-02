async function loadWordMapping(params) {
    try {
        const response = await fetch('../data/per-font-family/Hafs_Word_QCF_01.json');
        const data = await response.json();
        const hafsWordMapping = data.Hafs_Word;
        return hafsWordMapping;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return [];
    }
}

async function loadSurahNameMapping(params) {
    try {
        const response = await fetch('../data/Hafs_Sura.json');
        const data = await response.json();
        const hafsWordMapping = data.Hafs_Sura;
        return hafsWordMapping;
    } catch (error) {
        console.error('Error loading JSON data:', error);
        return [];
    }
}

// Word type mapping
// 1	Quran Words
// 2	Waqf Markes
// 3	Sagda Line
// 4	Basmala
// 5	Sura Name
// 6	Aya Number
// 7	Quarter Mark
// 8	Sagda Markes

async function populateAyat() {
    const wordMapping = await loadWordMapping();
    const surahMapping = await loadSurahNameMapping();

    const bodyElement = document.getElementById('body');
    bodyElement.innerHTML = '';

    // Override for RTL text direction
    const rtlOverride = '‮';
    const surahDiv = document.createDocumentFragment(); // Use DocumentFragment for better performance

    let currentSurah = null;
    let surahParagraph = null;

    for (let i = 0; i < wordMapping.length; i++) {
        // Check if the current Surah is different from the previous one
        if (wordMapping[i].Sura !== currentSurah) {
            if (surahParagraph) {
                surahDiv.appendChild(surahParagraph);
            }

            currentSurah = wordMapping[i].Sura;

            const surahTitle = document.createElement('div');
            surahTitle.className = 'surah-title';
            surahTitle.innerText = `Surah ${surahMapping[currentSurah - 1]?.Name ?? 'Unknown'}`;
            surahDiv.appendChild(surahTitle);

            surahParagraph = document.createElement('p');
            surahParagraph.className = 'ayat-quran';
            surahParagraph.innerHTML = rtlOverride; // Initialize with RTL override
        }

        // Intentionally have space character at the end of the file so that it can
        // wraps if not fit.
        surahParagraph.innerHTML += `<span style="font-family: ${wordMapping[i].FontName}_COLOR;">&#${wordMapping[i].FontCode};</span> `;

        // Basmalah
        if (wordMapping[i].Type == 4) {
            surahParagraph.innerHTML += '<br>';
        }
    }

    if (surahParagraph) {
        surahDiv.appendChild(surahParagraph);
    }

    bodyElement.appendChild(surahDiv); // Append all at once
}

populateAyat();