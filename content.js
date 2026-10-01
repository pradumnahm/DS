const courseModules = [
  {
    day: 1,
    title: "Linear Regression: Finding the Optimal Slope",
    track: "Supervised Learning",
    xp: 50,
    visualType: "regression",
    initialSlope: 1.5,
    initialIntercept: 10,
    dataset: [
      { x: 10, y: 25 }, { x: 20, y: 45 }, { x: 30, y: 50 },
      { x: 40, y: 72 }, { x: 50, y: 88 }, { x: 60, y: 105 }
    ],
    theory: {
      intuition: "Linear regression doesn't just guess lines—it minimizes the squared vertical distances (Residual Sum of Squares, or RSS) between each point and your line. When you minimize RSS, you find the line of best fit.",
      industry: "Used by ride-sharing apps (Uber/Ola) for surge pricing estimation based on real-time rider demand density, and by finance desks for Beta risk evaluations.",
      pitfall: "Assuming correlation proves causation. Adding arbitrary variables can show high statistical correlation (spurious correlations) while having zero causal connection."
    },
    code: `import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\n# Feature matrix (2D) and target vector\nX = np.array([[10], [20], [30], [40], [50], [60]])\ny = np.array([25, 45, 50, 72, 88, 105])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\n\nprint("Learned Slope (m):", model.coef_[0])\nprint("Learned Intercept (c):", model.intercept_)`,
    output: `Learned Slope (m): 1.5828\nLearned Intercept (c): 8.8571\nR² Score: 0.984 (Extremely High Fit)`,
    quiz: {
      scenario: "Your model gets an R² score of 0.99 on your training data, but performs terribly on new incoming user orders. What is the root cause?",
      options: [
        "Underfitting (The model was too simple to capture trends)",
        "Overfitting (The model memorized noise instead of true patterns)",
        "Data Imbalance (Too few target classes exist)"
      ],
      answer: 1,
      explanation: "A near-perfect training score combined with poor real-world inference is the classic hallmark of Overfitting: your model captured random noise rather than generalizable signals."
    }
  },
  {
    day: 2,
    title: "Logistic Regression: Probability & Decision Boundaries",
    track: "Classification",
    xp: 100,
    visualType: "sigmoid",
    theory: {
      intuition: "Standard lines don't work for predicting Yes/No decisions because predictions can go to negative infinity or positive infinity. Logistic regression squeezes any value into a smooth S-curve (Sigmoid function) between 0% and 100% probability.",
      industry: "Used in banking systems to assess credit card fraud in under 15 milliseconds by thresholding transactions at a strict probability cutoff (e.g., > 0.85).",
      pitfall: "Leaving the decision threshold at default 0.5 when dealing with imbalanced classes. For fraud or disease detection, a 0.5 threshold can fail to flag critical positive cases."
    },
    code: `from sklearn.linear_model import LogisticRegression\nimport numpy as np\n\n# Features: [Account Age, Transaction Amount]\nX = np.array([[2, 500], [40, 20], [1, 1200], [50, 15]])\ny = np.array([1, 0, 1, 0]) # 1: Fraud, 0: Normal\n\nclf = LogisticRegression().fit(X, y)\nprob = clf.predict_proba([[1.5, 950]])[0][1]\nprint(f"Fraud Probability: {prob * 100:.2f}%")`,
    output: `Fraud Probability: 93.42%\nClassification Decision: High Risk (Alert Sent)`,
    quiz: {
      scenario: "In a rare disease detection model where missing a patient is lethal, what metric should you prioritize optimizing?",
      options: [
        "Precision (Minimizing false alarms)",
        "Recall (Minimizing missed sick patients)",
        "Raw Accuracy (Overall total percent correct)"
      ],
      answer: 1,
      explanation: "Recall measures what proportion of actual positive cases were caught. When the cost of a false negative is extreme (like medical diagnosis), Recall is the metric to maximize."
    }
  },
  {
    day: 3,
    title: "Feature Distributions & Outlier Clipping",
    track: "Data Wrangling",
    xp: 150,
    visualType: "distribution",
    theory: {
      intuition: "Outliers exert massive leverage on distance-based algorithms ($K$-Means, linear models, neural nets). Visualizing distributions with Interquartile Ranges (IQR) lets you cleanly identify and clip corrupt anomalies.",
      industry: "Real-estate pricing platforms drop extreme multi-million dollar penthouses or zero-rupee registry transfers so the model learns realistic price-per-square-foot dynamics.",
      pitfall: "Blindly deleting all outliers without investigation. Some extreme values are actual high-value users or security breaches rather than measurement errors."
    },
    code: `import pandas as pd\nimport numpy as np\n\n# Compute IQR boundaries\nQ1 = df['price'].quantile(0.25)\nQ3 = df['price'].quantile(0.75)\nIQR = Q3 - Q1\n\nlower_limit = Q1 - 1.5 * IQR\nupper_limit = Q3 + 1.5 * IQR\nclean_df = df[(df['price'] >= lower_limit) & (df['price'] <= upper_limit)]`,
    output: `Raw Rows: 10,000\nOutliers Removed: 312\nNew Max Price: 1,240,000 (Down from 98,000,000)`,
    quiz: {
      scenario: "You have an income column skewed heavily by a few billionaires. What metric best describes the average person's income?",
      options: [
        "The Mean (Average)",
        "The Median (50th Percentile)",
        "The Standard Deviation"
      ],
      answer: 1,
      explanation: "The median is robust against extreme outliers, whereas the mean gets pulled heavily in the direction of long tails."
    }
  }
];