import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.metrics import classification_report, confusion_matrix, ConfusionMatrixDisplay

# ==============================================================================
# --- 1. Path Definitions ---
# ==============================================================================
# Define robust paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
DATA_PATH = os.path.join(BACKEND_DIR, 'data/telco_customer_churn.csv')
MODEL_DIR = os.path.join(BACKEND_DIR, 'models/')
VISUALS_DIR = os.path.join(BACKEND_DIR, 'reports/visuals/')

# ==============================================================================
# --- 2. Helper Functions (Our Modular "Splits") ---
# ==============================================================================

def load_and_clean_data(data_path):
    """
    Loads the data and performs all cleaning steps.
    Returns a cleaned DataFrame.
    """
    print("--- [Helper] Loading and Cleaning Data ---")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Data file not found at {data_path}")
        return None
    
    df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
    df.dropna(inplace=True)
    df['Churn'] = df['Churn'].map({'Yes': 1, 'No': 0})
    df_cleaned = df.drop('customerID', axis=1)
    print(f"Data cleaned. {df_cleaned.shape[0]} rows remaining.")
    return df_cleaned

def train_classifier_and_preprocessor(df_cleaned, visuals_dir):
    """
    Trains the main preprocessor and the Random Forest classifier.
    Saves the associated plots.
    Returns the fitted preprocessor and classifier model.
    """
    print("--- [Helper] Training Classifier & Preprocessor ---")
    
    # --- Define Features ---
    target_classifier = 'Churn'
    target_regressor = 'MonthlyCharges'
    features_df = df_cleaned.drop([target_classifier, target_regressor], axis=1, errors='ignore')
    numerical_features = features_df.select_dtypes(include=np.number).columns.tolist()
    categorical_features = features_df.select_dtypes(include='object').columns.tolist()

    # --- Build Preprocessor ---
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ],
        remainder='drop'
    )
    
    # --- Train Classifier ---
    X_c = features_df
    y_c = df_cleaned[target_classifier]
    X_train_c, X_test_c, y_train_c, y_test_c = train_test_split(X_c, y_c, test_size=0.2, random_state=42, stratify=y_c)
    
    # Fit preprocessor
    preprocessor.fit(X_train_c)
    
    # Transform data
    X_train_c_processed = preprocessor.transform(X_train_c)
    X_test_c_processed = preprocessor.transform(X_test_c)
    
    # Train model
    rf_model = RandomForestClassifier(random_state=42, n_estimators=100)
    rf_model.fit(X_train_c_processed, y_train_c)
    
    # --- Save Plots ---
    y_pred_c = rf_model.predict(X_test_c_processed)
    print("Random Forest Classifier Report:")
    print(classification_report(y_test_c, y_pred_c))

    # Save Feature Importance Plot
    try:
        feature_names = preprocessor.get_feature_names_out()
        importances = rf_model.feature_importances_
        forest_importances = pd.Series(importances, index=feature_names).sort_values(ascending=False)
        plt.figure(figsize=(10, 8))
        sns.barplot(x=forest_importances.head(10), y=forest_importances.head(10).index, palette='viridis')
        plt.title('Top 10 Feature Importances (Random Forest)')
        plt.savefig(os.path.join(VISUALS_DIR, 'feature_importance.png'), bbox_inches='tight')
        print(f"Saved: {VISUALS_DIR}/feature_importance.png")
    except Exception as e:
        print(f"Error saving feature importance plot: {e}")
    plt.close()

    # Save Confusion Matrix Plot
    try:
        cm = confusion_matrix(y_test_c, y_pred_c, labels=rf_model.classes_)
        disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['No Churn', 'Churn'])
        disp.plot(cmap='Blues')
        plt.title('Classifier Confusion Matrix')
        plt.savefig(os.path.join(VISUALS_DIR, 'confusion_matrix.png'), bbox_inches='tight')
        print(f"Saved: {VISUALS_DIR}/confusion_matrix.png")
    except Exception as e:
        print(f"Error saving confusion matrix plot: {e}")
    plt.close()

    # Return the *fitted* preprocessor and model
    return preprocessor, rf_model

def train_regressor(df_cleaned, preprocessor, visuals_dir):
    """
    Trains the Linear Regression model using the *already fitted* preprocessor.
    Saves the associated plots.
    Returns the fitted regression model.
    """
    print("--- [Helper] Training Regressor ---")
    
    target_classifier = 'Churn'
    target_regressor = 'MonthlyCharges'
    features_df = df_cleaned.drop([target_classifier, target_regressor], axis=1, errors='ignore')
    y_r = df_cleaned[target_regressor]
    
    # Use the fitted preprocessor
    X_r_processed = preprocessor.transform(features_df)
    
    # Train model
    lr_model = LinearRegression()
    lr_model.fit(X_r_processed, y_r)
    print("Linear Regression model trained.")

    # Save Regression Plot
    try:
        y_pred_r = lr_model.predict(X_r_processed)
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x=y_r, y=y_pred_r, alpha=0.5)
        plt.plot([y_r.min(), y_r.max()], [y_r.min(), y_r.max()], 'r--', lw=2)
        plt.xlabel('Actual Monthly Charges')
        plt.ylabel('Predicted Monthly Charges')
        plt.title('Regression: Actual vs. Predicted')
        plt.savefig(os.path.join(VISUALS_DIR, 'regression_actual_vs_pred.png'), bbox_inches='tight')
        print(f"Saved: {VISUALS_DIR}/regression_actual_vs_pred.png")
    except Exception as e:
        print(f"Error saving regression plot: {e}")
    plt.close()
    
    return lr_model

def train_clusterer(df_cleaned, visuals_dir):
    """
    Trains the K-Means clustering pipeline.
    Saves the associated plots.
    Returns the fitted clustering pipeline.
    """
    print("--- [Helper] Training Clusterer ---")
    cluster_features = df_cleaned[['tenure', 'MonthlyCharges']]
    
    # Build a self-contained pipeline
    kmeans_pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('kmeans', KMeans(n_clusters=3, random_state=42, n_init=10))
    ])
    
    kmeans_pipeline.fit(cluster_features)
    print("K-Means pipeline (Scaler + Model) trained.")

    # Save Clustering Plot
    try:
        cluster_labels = kmeans_pipeline.predict(cluster_features)
        plt.figure(figsize=(10, 6))
        sns.scatterplot(x=cluster_features['tenure'], y=cluster_features['MonthlyCharges'], hue=cluster_labels, palette='viridis', s=50, alpha=0.7)
        plt.title('K-Means Customer Segments (3 Clusters)')
        plt.xlabel('Tenure (Months)')
        plt.ylabel('Monthly Charges')
        plt.legend(title='Cluster')
        plt.savefig(os.path.join(VISUALS_DIR, 'kmeans_clusters.png'), bbox_inches='tight')
        print(f"Saved: {VISUALS_DIR}/kmeans_clusters.png")
    except Exception as e:
        print(f"Error saving clustering plot: {e}")
    plt.close('all') # Close all figs
    
    return kmeans_pipeline

def save_all_models(models_dict, model_dir):
    """
    Saves all fitted models and the preprocessor to the models directory.
    """
    print("--- [Helper] Saving All Models ---")
    for name, model in models_dict.items():
        filename = f"{name}.joblib"
        path = os.path.join(model_dir, filename)
        joblib.dump(model, path)
        print(f"Saved: {path}")

# ==============================================================================
# --- 3. Main Pipeline (The "Conductor") ---
# ==============================================================================

def main_pipeline():
    """
    This is the main function that runs the entire pipeline in order.
    It's clean, simple, and easy to explain.
    """
    
    print("\n" + "="*80)
    print("--- [START] DWM Training Pipeline ---")
    print("="*80)
    
    # Make sure dirs exist
    os.makedirs(MODEL_DIR, exist_ok=True)
    os.makedirs(VISUALS_DIR, exist_ok=True)

    # 1. Load Data
    df_cleaned = load_and_clean_data(DATA_PATH)
    if df_cleaned is None:
        return # Stop if data loading failed
    
    # 2. Train Classifier & Preprocessor
    preprocessor, rf_model = train_classifier_and_preprocessor(df_cleaned, VISUALS_DIR)
    
    # 3. Train Regressor
    lr_model = train_regressor(df_cleaned, preprocessor, VISUALS_DIR)
    
    # 4. Train Clusterer
    kmeans_pipeline = train_clusterer(df_cleaned, VISUALS_DIR)
    
    # 5. Save all models
    models_to_save = {
        "preprocessor": preprocessor,
        "classifier_rf": rf_model,
        "regression_linear": lr_model,
        "cluster_kmeans": kmeans_pipeline
    }
    save_all_models(models_to_save, MODEL_DIR)
    
    print("\n" + "="*80)
    print("--- [COMPLETE] Pipeline Finished Successfully ---")
    print("="*80 + "\n")

# This allows you to run the script by typing `python scripts/train_model.py`
if __name__ == "__main__":
    main_pipeline()