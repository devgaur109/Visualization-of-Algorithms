from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def visualize_rna():
    sequence = "ACUGGGCACACGGUGGUCCACACGUGUGUACGGCGCGUCAA"
    pairs = [(0, 37), (1, 36), (3, 35), (4,33), (5,30),(6,27),(7,26),(8,25),(9,24),(10,23),(11,22),(12,20),(13,19)]
    return render_template('index.html', sequence=sequence, pairs=pairs)

if __name__ == "__main__":
    app.run(debug=True)
