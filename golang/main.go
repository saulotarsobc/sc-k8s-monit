package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	corev1 "k8s.io/api/core/v1"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"

	metricsclient "k8s.io/metrics/pkg/client/clientset/versioned"
)

type NodeMetric struct {
	Name       string                 `json:"name"`
	NodeInfo   map[string]string      `json:"nodeInfo"`
	Addresses  string                 `json:"addresses"`
	Status     string                 `json:"status"`
	Capacity   map[string]interface{} `json:"capacity"`
	Conditions []corev1.NodeCondition `json:"conditions"`
}

type PodMetric struct {
	Namespace string `json:"namespace"`
	Pod       string `json:"pod"`
	CPU       string `json:"cpu"`
	Memory    string `json:"memory"` // Pode ser convertido para bytes depois
}

type Result struct {
	Timestamp  string       `json:"timestamp"`
	Nodes      []NodeMetric `json:"nodes"`
	PodMetrics []PodMetric  `json:"podMetrics"`
	Namespaces []string     `json:"namespaces"`
}

func main() {
	// Constrói a configuração a partir do kubeconfig local
	kubeconfig := clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
		clientcmd.NewDefaultClientConfigLoadingRules(),
		&clientcmd.ConfigOverrides{},
	)
	config, err := kubeconfig.ClientConfig()
	if err != nil {
		log.Fatalf("Erro ao carregar configuração do Kubernetes: %v", err)
	}

	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		log.Fatalf("Erro ao criar clientset Kubernetes: %v", err)
	}

	metricsClient, err := metricsclient.NewForConfig(config)
	if err != nil {
		log.Fatalf("Erro ao criar clientset de métricas: %v", err)
	}

	ctx := context.Background()

	// Coleta dos nodes
	nodes, err := clientset.CoreV1().Nodes().List(ctx, v1.ListOptions{})
	if err != nil {
		log.Fatalf("Erro ao obter nós: %v", err)
	}

	var nodeMetrics []NodeMetric
	for _, node := range nodes.Items {
		address := ""
		for _, addr := range node.Status.Addresses {
			if addr.Type == "ExternalIP" {
				address = addr.Address
				break
			}
		}
		nodeMetrics = append(nodeMetrics, NodeMetric{
			Name:      node.Name,
			NodeInfo:  map[string]string{"kubeletVersion": node.Status.NodeInfo.KubeletVersion}, // ajustar conforme necessário
			Addresses: address,
			Status:    string(node.Status.Conditions[len(node.Status.Conditions)-1].Type),
			Capacity: map[string]interface{}{
				"cpu":               node.Status.Capacity.Cpu().String(),
				"memory":            node.Status.Capacity.Memory().String(),
				"ephemeral-storage": node.Status.Capacity.StorageEphemeral().String(),
				"pods":              node.Status.Capacity.Pods().Value(),
			},
			Conditions: node.Status.Conditions,
		})
	}

	// Coleta de métricas dos pods
	podMetricsList, err := metricsClient.MetricsV1beta1().PodMetricses("").List(ctx, v1.ListOptions{})
	if err != nil {
		log.Fatalf("Erro ao obter métricas dos pods: %v", err)
	}

	var podMetrics []PodMetric
	for _, podMetric := range podMetricsList.Items {
		for _, container := range podMetric.Containers {
			podMetrics = append(podMetrics, PodMetric{
				Namespace: podMetric.Namespace,
				Pod:       podMetric.Name,
				CPU:       container.Usage.Cpu().String(),
				Memory:    container.Usage.Memory().String(),
			})
		}
	}

	// Coleta dos namespaces
	nsList, err := clientset.CoreV1().Namespaces().List(ctx, v1.ListOptions{})
	if err != nil {
		log.Fatalf("Erro ao obter namespaces: %v", err)
	}

	var namespaces []string
	for _, ns := range nsList.Items {
		namespaces = append(namespaces, ns.Name)
	}

	// Monta resultado final
	result := Result{
		Timestamp:  time.Now().Format(time.RFC3339),
		Nodes:      nodeMetrics,
		PodMetrics: podMetrics,
		Namespaces: namespaces,
	}

	// Salva em JSON
	file, err := os.Create("metrics-k8s.json")
	if err != nil {
		log.Fatalf("Erro ao criar arquivo JSON: %v", err)
	}
	defer file.Close()

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(result); err != nil {
		log.Fatalf("Erro ao escrever JSON: %v", err)
	}

	fmt.Println("Métricas salvas em metrics-k8s.json")
}
