const express = require('express');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const SUPABASE_URL = 'https://ctinfdachjsqwqbuumgj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lOy6jzHus_ICjJX4tDvxrQ_u7xpSojJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cases = [];

app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        const { name, age, exam } = req.body;
        let fileUrl = '';

        if (req.file) {
            const fileName = ${Date.now()}-${encodeURIComponent(req.file.originalname)};
            const { error } = await supabase.storage
                .from('MEDICAL-FILES')
                .upload(fileName, req.file.buffer, { contentType: req.file.mimetype });

            if (!error) {
                const { data } = supabase.storage.from('MEDICAL-FILES').getPublicUrl(fileName);
                fileUrl = data.publicUrl;
            }
        }

        const newCase = {
            id: Date.now(),
            name: name || 'بدون اسم',
            age: age || '-',
            exam: exam || '-',
            zipUrl: fileUrl,
            status: 'pending',
            reportText: '',
            wordUrl: null
        };

        cases.unshift(newCase);
        res.json({ success: true, case: newCase });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/cases', (req, res) => res.json(cases));

app.post('/api/report/:id', upload.single('wordFile'), async (req, res) => {
    try {
        const item = cases.find(c => c.id == req.params.id);
        if (item) {
            item.reportText = req.body.reportText || '';
            if (req.file) {
                const fileName = reports/${Date.now()}-${encodeURIComponent(req.file.originalname)};
                await supabase.storage.from('MEDICAL-FILES').upload(fileName, req.file.buffer);
                const { data } = supabase.storage.from('MEDICAL-FILES').getPublicUrl(fileName);
                item.wordUrl = data.publicUrl;
            }
            item.status = 'completed';
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(Server running on port ${PORT}));
