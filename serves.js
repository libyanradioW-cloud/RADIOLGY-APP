const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let cases = [
    { id: 1, name: "محمود علي الأشهر", age: "45", exam: "CT Scan", status: "pending" },
    { id: 2, name: "سالم محمد النائب", age: "32", exam: "MRI", status: "completed" }
];

app.get('/api/cases', (req, res) => {
    res.json(cases);
});

app.post('/api/upload', (req, res) => {
    const { name, age, exam } = req.body;
    const newCase = {
        id: Date.now(),
        name: name || 'بدون اسم',
        age: age || '-',
        exam: exam || '-',
        status: 'pending'
    };
    cases.unshift(newCase);
    res.json({ success: true, case: newCase });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(Server is running on port ${PORT});
});
